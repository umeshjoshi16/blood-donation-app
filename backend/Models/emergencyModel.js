import mongoose from "mongoose";

const emergencySchema=new mongoose.Schema({

hospitalId: {
    type: mongoose.Schema.Types.ObjectId,     
    ref: "Hospital",
    required: true,
  },
  hospitalName:{
    type:String,
    required:true,
  },
  hospitalCity:{
    type:String,
    required:true,
    
  },
  
  hospitalDistrict:{
    type:String,
    required:true,
  },
  patientName:{
    type:String,
    required:true,
  },
  bloodType:{
    type:String,
     enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    required:true,
  },
  units:{
    type:Number,
    required:true,
     min: 1,
  },
  reason:{
    type:String,
    required:true,
  },
  status: {
    type: String,
    enum: ["Pending", "Fulfilled", "Cancelled"],
    default: "Pending",

},
 respondedBy: [
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      required: true,
    },
    unitsDonated: { type: Number, default: 1 },
    message: { type: String, default: "" },
    respondedAt: { type: Date, default: Date.now },
    timesDonated: { type: Number, default: 0 } 
  },
],
},
{timestamps:true}
);

export default mongoose.model("EmergencyRequest",emergencySchema);



