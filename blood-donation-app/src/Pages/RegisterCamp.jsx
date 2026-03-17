import { useState } from 'react';
import {
  X, Droplets, Calendar, MapPin,
  User, Phone, Mail, Heart,
  ChevronRight, CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:8000';



const NEPAL_LOCATIONS = {
  'Koshi Province': {
    'Taplejung':   ['Taplejung', 'Phungling', 'Sirijangha'],
    'Panchthar':   ['Phidim', 'Tumbewa', 'Hilihang'],
    'Ilam':        ['Ilam', 'Suryodaya', 'Maijogmai'],
    'Jhapa':       ['Bhadrapur', 'Birtamod', 'Mechinagar', 'Damak', 'Kankai'],
    'Morang':      ['Biratnagar', 'Urlabari', 'Pathari-Shanischare', 'Sundarharaicha'],
    'Sunsari':     ['Dharan', 'Inaruwa', 'Itahari', 'Duhabi'],
    'Dhankuta':    ['Dhankuta', 'Pakhribas', 'Chaubise'],
    'Terhathum':   ['Myanglung', 'Lahachok', 'Aathrai'],
    'Sankhuwasabha': ['Khandbari', 'Chainpur', 'Madi'],
    'Bhojpur':     ['Bhojpur', 'Shadananda', 'Ramprasad Rai'],
    'Solukhumbu':  ['Salleri', 'Namche', 'Sotang'],
    'Okhaldhunga': ['Okhaldhunga', 'Manebhanjyang', 'Khijidemba'],
    'Khotang':     ['Diktel', 'Rupakot', 'Halesi Tuwachung'],
    'Udayapur':    ['Gaighat', 'Triyuga', 'Chaudandigadhi'],
  },
  'Madhesh Province': {
    'Saptari':   ['Rajbiraj', 'Kanchanrup', 'Dakneshwori', 'Saptakoshi'],
    'Siraha':    ['Siraha', 'Lahan', 'Golbazar', 'Mirchaiya'],
    'Dhanusha':  ['Janakpur', 'Dhanusadham', 'Chhireshwarnath', 'Sabaila'],
    'Mahottari': ['Jaleshwar', 'Bardibas', 'Gaushala', 'Matihani'],
    'Sarlahi':   ['Malangwa', 'Haripur', 'Lalbandi', 'Kabilasi'],
    'Rautahat':  ['Gaur', 'Brindaban', 'Chandrapur', 'Rajpur'],
    'Bara':      ['Kalaiya', 'Jeetpur-Simara', 'Kolhabi', 'Nijgadh'],
    'Parsa':     ['Birgunj', 'Pokhariya', 'Bahudarmai', 'Parsagadhi'],
  },
  'Bagmati Province': {
    'Kathmandu':      ['Kathmandu', 'Kirtipur', 'Kageshwori-Manahara', 'Tokha', 'Budhanilkantha', 'Gokarneshwar', 'Chandragiri', 'Dakshinkali', 'Nagarjun', 'Tarakeshwar', 'Shankharapur'],
    'Lalitpur':       ['Lalitpur', 'Mahalaxmi', 'Godawari', 'Konjyosom'],
    'Bhaktapur':      ['Bhaktapur', 'Changunarayan', 'Suryabinayak', 'Madhyapur Thimi'],
    'Kavrepalanchok': ['Dhulikhel', 'Banepa', 'Panauti', 'Namobuddha', 'Panchkhal'],
    'Sindhupalchok':  ['Chautara', 'Melamchi', 'Barabise', 'Helambu'],
    'Dolakha':        ['Charikot', 'Jiri', 'Bhimeshwar', 'Sailung'],
    'Ramechhap':      ['Manthali', 'Ramechhap', 'Likhu Tamakoshi', 'Doramba'],
    'Sindhuli':       ['Sindhulimadi', 'Kamalamai', 'Golanjor', 'Dudhauli'],
    'Makwanpur':      ['Hetauda', 'Thaha', 'Manahari', 'Bagmati'],
    'Rasuwa':         ['Dhunche', 'Uttargaya', 'Gosaikunda', 'Kalika'],
    'Nuwakot':        ['Bidur', 'Tadi', 'Kakani', 'Dupcheshwar'],
    'Dhading':        ['Nilkantha', 'Benighat', 'Gajuri', 'Thakre'],
    'Chitwan':        ['Bharatpur', 'Ratnanagar', 'Rapti', 'Kalika', 'Ichchhakamana'],
  },
  'Gandaki Province': {
    'Gorkha':      ['Gorkha', 'Palungtar', 'Arughat', 'Tsum Nubri'],
    'Lamjung':     ['Besisahar', 'Sundarbazar', 'Rainas', 'Madhya Nepal'],
    'Tanahu':      ['Damauli', 'Bhanu', 'Shuklagandaki', 'Byas'],
    'Kaski':       ['Pokhara', 'Lekhnath', 'Machhapuchchhre', 'Rupa'],
    'Syangja':     ['Putalibazar', 'Galyang', 'Chapakot', 'Waling'],
    'Parbat':      ['Kusma', 'Phalebas', 'Jaljala', 'Modi'],
    'Baglung':     ['Baglung', 'Dhorpatan', 'Burtibang', 'Bareng'],
    'Myagdi':      ['Beni', 'Mangala', 'Malika', 'Annapurna'],
    'Mustang':     ['Mustang', 'Thasang', 'Dalome', 'Gharapjhong'],
    'Manang':      ['Chame', 'Narpa Bhumi', 'Narphu', 'Neshyang'],
    'Nawalpur':    ['Kawasoti', 'Madhyabindu', 'Devchuli', 'Bulingtar'],
    'Palpa':       ['Tansen', 'Rampur', 'Mathagadhi', 'Nisdi'],
  },
  'Lumbini Province': {
    'Kapilvastu':  ['Kapilvastu', 'Shivaraj', 'Buddhabhumi', 'Krishnanagar'],
    'Rupandehi':   ['Butwal', 'Tilottama', 'Siddharthanagar', 'Sainamaina', 'Lumbini Sanskritik'],
    'Nawalparasi (West)': ['Sunwal', 'Ramgram', 'Palhinandan', 'Pratappur'],
    'Arghakhanchi': ['Sandhikharka', 'Bhumikasthan', 'Malarani', 'Panini'],
    'Gulmi':       ['Tamghas', 'Musikot', 'Resunga', 'Isma'],
    'Pyuthan':     ['Pyuthan', 'Swargadwari', 'Jhimruk', 'Sarumarani'],
    'Rolpa':       ['Rolpa', 'Runtigadhi', 'Thabang', 'Madi'],
    'Rukum (East)': ['Putha Uttarganga', 'Bhume'],
    'Dang':        ['Tulsipur', 'Ghorahi', 'Lamahi', 'Rajpur', 'Shantinagar'],
    'Banke':       ['Nepalgunj', 'Kohalpur', 'Rapti Sonari', 'Narainapur'],
    'Bardiya':     ['Gulariya', 'Rajapur', 'Badhaiyatal', 'Geruwa'],
  },
  'Karnali Province': {
    'Surkhet':   ['Birendranagar', 'Bheriganga', 'Panchpuri', 'Chaukune'],
    'Dailekh':   ['Narayan', 'Chamunda Bindrasaini', 'Bhairabi', 'Dungeshwar'],
    'Jajarkot':  ['Bheri', 'Chhedagad', 'Kuse', 'Junichande'],
    'Rukum (West)': ['Musikot', 'Aathbiskot', 'Tribeni', 'Sanibheri'],
    'Salyan':    ['Sharada', 'Bangad Kupinde', 'Kapurkot', 'Bagchaur'],
    'Dolpa':     ['Thuli Bheri', 'Tripurasundari', 'Dunai', 'Jagadulla'],
    'Mugu':      ['Khatyad', 'Mugum Karmarong', 'Chhayanath Rara', 'Soru'],
    'Humla':     ['Simkot', 'Chankheli', 'Namkha', 'Sarkegad'],
    'Jumla':     ['Chandannath', 'Tatopani', 'Guthichaur', 'Hima'],
    'Kalikot':   ['Raskot', 'Palata', 'Sanni Triveni', 'Pachaljharana'],
  },
  'Sudurpashchim Province': {
    'Kanchanpur': ['Bhimdatta', 'Shuklaphanta', 'Belauri', 'Punarbas', 'Krishnapur'],
    'Kailali':    ['Dhangadhi', 'Tikapur', 'Godawari', 'Ghodaghodi', 'Bhajani'],
    'Doti':       ['Dipayal-Silgadhi', 'Shikhar', 'Purbichauki', 'Aadarsha'],
    'Accham':     ['Mangalsen', 'Sanphebagar', 'Mellekh', 'Turmakhand'],
    'Bajhang':    ['Jayaprithivi', 'Talkot', 'Bungal', 'Kanda'],
    'Bajura':     ['Triveni', 'Badimalika', 'Budhinanda', 'Himali'],
    'Baitadi':    ['Dasharathchand', 'Patan', 'Melauli', 'Surnaya'],
    'Darchula':   ['Shailyashikhar', 'Marma', 'Naugad', 'Duhun'],
  },
};

const PROVINCES  = Object.keys(NEPAL_LOCATIONS);
const getDistricts = (province) => province ? Object.keys(NEPAL_LOCATIONS[province] || {}) : [];
const getCities    = (province, district) =>
  province && district ? (NEPAL_LOCATIONS[province]?.[district] || []) : [];



export default function RegisterCamp({ campId, donorProfile, onClose }) {

  const [form, setForm] = useState({
    name:          donorProfile?.userName    ?? '',
    dateOfBirth:   donorProfile?.dateOfBirth
      ? new Date(donorProfile.dateOfBirth).toISOString().split('T')[0]
      : '',
    gender:        donorProfile?.gender      ?? '',
    bloodGroup:    donorProfile?.bloodGroup  ?? '',
    phoneNumber:   donorProfile?.phoneNumber ?? '',
    email:         donorProfile?.email       ?? '',
    province:      donorProfile?.province    ?? '',
    district:      donorProfile?.district    ?? '',
    city:          donorProfile?.city        ?? '',
    weight:        '',
    previousDonor: donorProfile?.donatedBlood > 0,
    lastDonated:   donorProfile?.lastDonated
      ? new Date(donorProfile.lastDonated).toISOString().split('T')[0]
      : '',
    recentFever:   false,
    recentTattoo:  false,
    alcoholLast24h:false,
    consent:       false,
  });

  const [step,       setStep]       = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  // When province changes, reset district & city
  const handleProvinceChange = (val) => {
    setForm(prev => ({ ...prev, province: val, district: '', city: '' }));
  };
  // When district changes, reset city
  const handleDistrictChange = (val) => {
    setForm(prev => ({ ...prev, district: val, city: '' }));
  };

  const step1Valid =
    form.name.trim() && form.dateOfBirth && form.gender &&
    form.bloodGroup  && form.phoneNumber.trim() && form.email.trim() &&
    form.province    && form.district && form.city;

  const step2Valid =
    form.weight !== '' && Number(form.weight) >= 45 &&
    !form.recentFever && !form.recentTattoo && !form.alcoholLast24h;

  const step3Valid = form.consent;


 const handleSubmit = async () => {
  setSubmitting(true);
  try {
    // Build payload with EXACT field names from campRegistrationSchema
    const payload = {
      donorId:     donorProfile._id,          // ObjectId ref → Donor
      campId:      campId,                    // ObjectId ref → Camp

      // Personal Info — exact schema field names
      name:        form.name,
      dateOfBirth: form.dateOfBirth,
      gender:      form.gender,
      bloodGroup:  form.bloodGroup,
      phoneNumber: form.phoneNumber,
      email:       form.email,

      // Address
      province:    form.province,
      district:    form.district,
      city:        form.city,

      // Health Info
      weight:           Number(form.weight),
      previousDonor:    form.previousDonor,
      lastDonated:      form.previousDonor && form.lastDonated ? form.lastDonated : undefined,
      recentFever:      form.recentFever,
      recentTattoo:     form.recentTattoo,
      alcoholLast24h:   form.alcoholLast24h,

      // Consent
      consent:     form.consent,
    };

    console.log('Sending payload:', payload); // ← check this in console

    await axios.post(
      `${API}/dashboard-donor/register-camp`,
      payload,
      { withCredentials: true }
    );
    setSubmitted(true);
  } catch (err) {
    // Log full error so you can see the validation message
    console.error('Registration error:', err.response?.data);
    toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
  } finally {
    setSubmitting(false);
  }
};
  const districts = getDistricts(form.province);
  const cities    = getCities(form.province, form.district);

  const disqualified = form.recentFever || form.recentTattoo || form.alcoholLast24h;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 " onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">

        {/* ── Header ── */}
        <div className="bg-linear-to-r from-red-600 to-red-700 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Droplets size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Camp Registration</h2>
              <p className="text-white/60 text-xs mt-0.5">
                {submitted ? 'Complete' : `Step ${step} of 3`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* ── Step bar ── */}
        {!submitted && (
          <div className="px-6 pt-5 pb-3 shrink-0">
            <div className="flex items-center">
              {['Personal', 'Health', 'Confirm'].map((label, i) => {
                const n      = i + 1;
                const active = step === n;
                const done   = step > n;
                return (
                  <div key={label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        done   ? 'bg-green-500 text-white'
                        : active ? 'bg-red-600 text-white ring-4 ring-red-100'
                        :          'bg-gray-100 text-gray-400'
                      }`}>
                        {done ? <CheckCircle2 size={14} /> : n}
                      </div>
                      <span className={`text-[10px] font-semibold ${
                        active ? 'text-red-600' : done ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all ${
                        done ? 'bg-green-400' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ══ SUCCESS ══ */}
          {submitted && (
            <div className="flex flex-col items-center justify-center py-14 px-6 gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={38} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Registered Successfully!</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-xs">
                  You are now registered for this blood donation camp.
                  Thank you for choosing to save lives.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition text-sm"
              >
                Done
              </button>
            </div>
          )}

          {/* ══ STEP 1 — Personal Info ══ */}
          {!submitted && step === 1 && (
            <div className="px-6 py-5 space-y-5">

              {/* Personal */}
              <div>
                <SectionLabel icon={<User size={13} />} text="Personal Information" />
                <div className="grid grid-cols-2 gap-3 mt-3">

                  <Field label="Full Name" span={2} required>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Enter your full name"
                      className={INPUT_CLS}
                    />
                  </Field>

                  <Field label="Date of Birth" required>
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={e => set('dateOfBirth', e.target.value)}
                      className={INPUT_CLS}
                    />
                  </Field>

                  <Field label="Gender" required>
                    <select
                      value={form.gender}
                      onChange={e => set('gender', e.target.value)}
                      className={SELECT_CLS}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>

                  <Field label="Blood Group" required>
                    <select
                      value={form.bloodGroup}
                      onChange={e => set('bloodGroup', e.target.value)}
                      className={SELECT_CLS}
                    >
                      <option value="">Select</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Phone Number" required>
                    <div className="relative">
                      <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={form.phoneNumber}
                        onChange={e => set('phoneNumber', e.target.value)}
                        placeholder="98XXXXXXXX"
                        className={`${INPUT_CLS} pl-8`}
                      />
                    </div>
                  </Field>

                  <Field label="Email" span={2} required>
                    <div className="relative">
                      <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                        placeholder="you@example.com"
                        className={`${INPUT_CLS} pl-8`}
                      />
                    </div>
                  </Field>
                </div>
              </div>

              {/* Address */}
              <div>
                <SectionLabel icon={<MapPin size={13} />} text="Address" />
                <div className="grid grid-cols-2 gap-3 mt-3">

                  <Field label="Province" span={2} required>
                    <select
                      value={form.province}
                      onChange={e => handleProvinceChange(e.target.value)}
                      className={SELECT_CLS}
                    >
                      <option value="">Select Province</option>
                      {PROVINCES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="District" required>
                    <select
                      value={form.district}
                      onChange={e => handleDistrictChange(e.target.value)}
                      disabled={!form.province}
                      className={`${SELECT_CLS} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <option value="">Select District</option>
                      {districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="City / Municipality" required>
                    <select
                      value={form.city}
                      onChange={e => set('city', e.target.value)}
                      disabled={!form.district}
                      className={`${SELECT_CLS} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <option value="">Select City</option>
                      {cities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>

                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 2 — Health ══ */}
          {!submitted && step === 2 && (
            <div className="px-6 py-5 space-y-5">
              <SectionLabel icon={<Heart size={13} />} text="Health Information" />

              {/* Weight */}
              <Field label="Weight (kg)" required>
                <input
                  type="number"
                  value={form.weight}
                  onChange={e => set('weight', e.target.value)}
                  placeholder="e.g. 65"
                  min={45}
                  className={INPUT_CLS}
                />
                {form.weight !== '' && Number(form.weight) < 45 && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={11} /> Minimum weight to donate is 45 kg
                  </p>
                )}
              </Field>

              {/* Previous donor */}
              <Field label="Have you donated blood previously?">
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[{ val: true, label: 'Yes' }, { val: false, label: 'No' }].map(opt => (
                    <button
                      key={String(opt.val)}
                      type="button"
                      onClick={() => set('previousDonor', opt.val)}
                      className={`py-2.5 rounded-xl border text-sm font-semibold transition ${
                        form.previousDonor === opt.val
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>

              {form.previousDonor && (
                <Field label="Last Donation Date">
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={form.lastDonated}
                      onChange={e => set('lastDonated', e.target.value)}
                      className={`${INPUT_CLS} pl-8`}
                    />
                  </div>
                </Field>
              )}

              {/* Health screening */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Health Screening
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Answer honestly. Answering "Yes" to any may affect eligibility.
                </p>
                <div className="space-y-2">
                  {[
                    { key: 'recentFever',    q: 'Have you had a fever in the last 7 days?'          },
                    { key: 'recentTattoo',   q: 'Have you gotten a tattoo in the last 6 months?'    },
                    { key: 'alcoholLast24h', q: 'Have you consumed alcohol in the last 24 hours?'   },
                  ].map(item => (
                    <div
                      key={item.key}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                        form[item.key] ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <p className="text-sm text-gray-700 pr-4 leading-snug flex-1">{item.q}</p>
                      <div className="flex gap-2 shrink-0">
                        {[{ val: true, label: 'Yes' }, { val: false, label: 'No' }].map(opt => (
                          <button
                            key={String(opt.val)}
                            type="button"
                            onClick={() => set(item.key, opt.val)}
                            className={`px-3 py-1 rounded-lg border text-xs font-bold transition ${
                              form[item.key] === opt.val
                                ? opt.val
                                  ? 'bg-red-600 border-red-600 text-white'
                                  : 'bg-green-600 border-green-600 text-white'
                                : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {disqualified && (
                <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Based on your responses, you may not be eligible to donate right now.
                    Please consult the camp coordinator on the day of the camp.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ══ STEP 3 — Review & Confirm ══ */}
          {!submitted && step === 3 && (
            <div className="px-6 py-5 space-y-4">
              <SectionLabel icon={<CheckCircle2 size={13} />} text="Review & Confirm" />

              <ReviewGroup title="Personal">
                <ReviewRow label="Full Name"   val={form.name} />
                <ReviewRow label="Date of Birth" val={form.dateOfBirth} />
                <ReviewRow label="Gender"      val={form.gender} />
                <ReviewRow label="Blood Group" val={form.bloodGroup} highlight />
                <ReviewRow label="Phone"       val={form.phoneNumber} />
                <ReviewRow label="Email"       val={form.email} />
              </ReviewGroup>

              <ReviewGroup title="Address">
                <ReviewRow label="Province" val={form.province} />
                <ReviewRow label="District" val={form.district} />
                <ReviewRow label="City"     val={form.city} />
              </ReviewGroup>

              <ReviewGroup title="Health">
                <ReviewRow label="Weight"          val={`${form.weight} kg`} />
                <ReviewRow label="Previous Donor"  val={form.previousDonor ? 'Yes' : 'No'} />
                {form.previousDonor && form.lastDonated && (
                  <ReviewRow label="Last Donated"  val={form.lastDonated} />
                )}
                <ReviewRow label="Recent Fever"    val={form.recentFever    ? 'Yes' : 'No'} warn={form.recentFever} />
                <ReviewRow label="Recent Tattoo"   val={form.recentTattoo   ? 'Yes' : 'No'} warn={form.recentTattoo} />
                <ReviewRow label="Alcohol (24h)"   val={form.alcoholLast24h ? 'Yes' : 'No'} warn={form.alcoholLast24h} />
              </ReviewGroup>

              {/* Consent checkbox */}
              <div
                onClick={() => set('consent', !form.consent)}
                className={`flex gap-3 items-start rounded-xl border p-4 cursor-pointer select-none transition ${
                  form.consent ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${
                  form.consent ? 'bg-green-600 border-green-600' : 'border-gray-300'
                }`}>
                  {form.consent && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  I consent to donate blood and allow storing my data for this camp.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!submitted && (
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0 bg-white">
            {step > 1 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Back
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 ? !step1Valid : !step2Valid}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-1.5"
              >
                Continue <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!step3Valid || submitting}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {submitting
                  ? <><Loader2 size={14} className="animate-spin" /> Submitting…</>
                  : <><Heart size={14} /> Confirm Registration</>
                }
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLE CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const INPUT_CLS  = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:bg-white focus:border-red-400 focus:outline-none transition placeholder:text-gray-400';
const SELECT_CLS = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:bg-white focus:border-red-400 focus:outline-none transition appearance-none';

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SectionLabel({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-red-500">{icon}</span>
      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">{text}</p>
    </div>
  );
}

function Field({ label, required, span, children }) {
  return (
    <div className={`space-y-1.5 ${span === 2 ? 'col-span-2' : ''}`}>
      <label className="text-xs font-semibold text-gray-500">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function ReviewGroup({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      </div>
      <div className="divide-y divide-gray-50 bg-white">{children}</div>
    </div>
  );
}

function ReviewRow({ label, val, highlight, warn }) {
  return (
    <div className="flex justify-between items-center px-4 py-2.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-xs font-semibold ${
        warn      ? 'text-red-500'
        : highlight ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded-full'
        :             'text-gray-800'
      }`}>
        {val || '—'}
      </span>
    </div>
  );
}