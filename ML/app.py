from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# =============================================================================
# LOAD ML ARTIFACTS
# =============================================================================
try:
    model = joblib.load(os.path.join(BASE_DIR, 'model.pkl'))
    scaler = joblib.load(os.path.join(BASE_DIR, 'scaler.pkl'))
    feature_columns = joblib.load(os.path.join(BASE_DIR, 'feature_columns.pkl'))
    print("="*55)
    print("   model.pkl, scaler.pkl, feature_columns.pkl loaded successfully")
    print(f"   Features: {feature_columns}")
    print("="*55)
except FileNotFoundError as e:
    print(f"\nERROR: {e}")
    print("Run train_model.py first to generate model artifacts.")
    exit(1)

# =============================================================================
# LOAD CSV — donor history lookup
# =============================================================================
CSV_FILENAME = 'blood donor list final wala.csv'
csv_path = os.path.join(BASE_DIR, CSV_FILENAME)

DONOR_HISTORY = {}
try:
    df_csv = pd.read_csv(csv_path)
    for _, row in df_csv.iterrows():
        email = str(row.get('email', '')).strip().lower()
        if email:
            DONOR_HISTORY[email] = {
                'months_since_first_donation': int(row.get('months_since_first_donation', 0)),
                'number_of_donation': int(row.get('number_of_donation', 0)),
                'pints_donated': int(row.get('pints_donated', 0)),
                'blood_group': str(row.get('blood_group', 'O+')).strip()
            }
    print("="*55)
    print(f"CSV loaded: {len(DONOR_HISTORY)} donor records indexed by email")
    print(f"CSV file: {CSV_FILENAME}")
    print("="*55)
except FileNotFoundError:
    print(f"\nWARNING: '{CSV_FILENAME}' not found in {BASE_DIR}")
    print("Donor history will be empty for all emails.\n")

# =============================================================================
# HELPERS
# =============================================================================
def build_features(donor):
    n = int(donor.get('number_of_donation', 0))
    m = int(donor.get('months_since_first_donation', 0))
    p = int(donor.get('pints_donated', 0))

    avg_gap = round(m/n,4) if n>0 else 0
    donation_frequency = round(n/m,4) if m>0 else 0
    avg_pints = round(p/n,4) if n>0 else 0

    row = {
        'months_since_first_donation': m,
        'avg_gap': avg_gap,
        'donation_frequency': donation_frequency,
        'avg_pints_per_donation': avg_pints,
        'blood_group': donor.get('blood_group','O+')
    }

    df = pd.DataFrame([row])
    df = pd.get_dummies(df, columns=['blood_group'])
    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0
    df = df[feature_columns]
    return df

def get_priority(probability):
    if probability >= 0.75:
        return 'HIGH'
    elif probability >= 0.45:
        return 'MEDIUM'
    else:
        return 'LOW'

def score_donor(donor):
    features_df = build_features(donor)
    scaled = scaler.transform(features_df)
    prediction = int(model.predict(scaled)[0])
    probability = round(float(model.predict_proba(scaled)[0][1]),4)
    return {
        'email': donor.get('email',''),
        'username': donor.get('username','') or donor.get('name',''),
        'blood_group': donor.get('blood_group',''),
        'probability': probability,
        'is_frequent_donor': prediction,
        'label': 'Frequent Donor' if prediction==1 else 'Infrequent Donor',
        'priority': get_priority(probability),
        'found_in_csv': donor.get('found_in_csv', False)
    }

# =============================================================================
# ROUTES
# =============================================================================

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status':'running',
        'message':'Daan ML Server is active',
        'model':'Logistic Regression — Frequent Donor Predictor',
        'csv_donors': len(DONOR_HISTORY)
    }), 200


@app.route('/predict-batch', methods=['POST'])
def predict_batch():
    try:
        print("\n" + "="*60)
        print("📥 REQUEST RECEIVED FROM FRONTEND")

        # Raw request
        print("Raw request.data:", request.data)

        # Parsed JSON
        body = request.get_json(force=True)
        print("Parsed JSON body:", body)

        if not body or 'emails' not in body:
            print("❌ ERROR: emails missing")
            return jsonify({'error':'emails array is required'}),400

        emails = body.get('emails', [])
        hospital_city = body.get('hospital_city','')
        blood_group_needed = body.get('blood_group_needed','')

        print("Emails:", emails)
        print("Hospital City:", hospital_city)
        print("Blood Group Needed:", blood_group_needed)

        if not emails:
            print("❌ ERROR: Empty email list")
            return jsonify({'error':'No emails provided'}),400

        results = []
        skipped = 0

        for email in emails:
            try:
                email_key = str(email).strip().lower()

                history = DONOR_HISTORY.get(email_key,{
                    'months_since_first_donation':0,
                    'number_of_donation':0,
                    'pints_donated':0,
                    'blood_group':'O+'
                })

                donor_obj = {
                    'email': email_key,
                    'username': '',
                    'found_in_csv': email_key in DONOR_HISTORY,
                    **history
                }

                result = score_donor(donor_obj)
                results.append(result)

            except Exception as e:
                skipped += 1
                print(f"❌ Error scoring {email}: {e}")

        # Sort
        results.sort(key=lambda x: x['probability'], reverse=True)

        for i, r in enumerate(results):
            r['rank'] = i+1

        response_data = {
            'hospital_city': hospital_city,
            'blood_group_needed': blood_group_needed,
            'total_donors': len(results),
            'skipped': skipped,
            'ranked_donors': results
        }

        print("\n📤 RESPONSE SENT TO FRONTEND")
        print(response_data)
        print("="*60 + "\n")

        return jsonify(response_data),200

    except Exception as e:
        print("🔥 SERVER ERROR:", str(e))
        return jsonify({'error': str(e)}),500


# =============================================================================
# RUN SERVER
# =============================================================================
if __name__ == '__main__':
    print("\n" + "="*55)
    print("Daan ML Server — Blood Donor Predictor")
    print("="*55)
    print("URL : http://localhost:5001")
    print("Route: POST /predict-batch")
    print("="*55 + "\n")

    app.run(host='0.0.0.0', port=5001, debug=True)