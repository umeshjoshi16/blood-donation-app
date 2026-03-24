import mongoose from "mongoose";

const donationResponseSchema = new mongoose.Schema({
  emergencyRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmergencyRequest",
    required: true,
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true,
  },
  // Auto-filled from donorProfile
  donorName: { type: String, required: true },
  donorBloodGroup: { type: String, required: true },
  donorPhone: { type: String, required: true },
  donorCity: { type: String, required: true },

  
  message: { type: String, default: "" },

  
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
  hospitalName: { type: String },

  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
}, { timestamps: true });

export default mongoose.model("DonationResponse", donationResponseSchema);