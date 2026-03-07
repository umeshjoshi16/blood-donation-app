
import mongoose from "mongoose";

const campRegistrationSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
    campId: { type: mongoose.Schema.Types.ObjectId, ref: "Camp", required: true },

    // Personal Info
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["male","female","other"], required: true },
    bloodGroup: { type: String, enum: ["A+","A-","B+","B-","AB+","AB-","O+","O-"], required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },

    // Address
    province: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },

    // Health Info
    weight: { type: Number, required: true, min: 45 }, 
      previousDonor: { type: Boolean, default: false },
 
lastDonated: {
  type: Date,
  required: false,
},
  

    recentFever: { type: Boolean, default: false },
    recentTattoo: { type: Boolean, default: false },
    alcoholLast24h: { type: Boolean, default: false },

   

    // Consent
    consent: { type: Boolean, required: true },

    // Registration status
    registrationStatus: {
      type: String,
      enum: ["Registered", "Cancelled", "Completed"],
      default: "Registered",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CampRegistration", campRegistrationSchema);