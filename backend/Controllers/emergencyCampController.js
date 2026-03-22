import EmergencyRequest from "../Models/emergencyModel.js";
import DonationResponse from "../Models/emergencyDonationModel.js"


export const emergencyRequest=async(req,res)=>{

  try{
    const{patientName,bloodType,units,reason
      
    }=req.body;

    if(!patientName||!bloodType||!units||!reason){
      return res.status(400).json({
        message:"Fill all the required fields",
      })
    }

    const emergencyCamp=await EmergencyRequest.create({
      patientName,
      bloodType,
      units,
      reason,
      hospitalId: req.user._id,
      hospitalName:req.user.hospitalName,
      hospitalCity: req.user.city,
      hospitalDistrict: req.user.district,


    })
      res.status(200).json({
      message: "Emergency Request registered successfully",
      data:emergencyCamp
    });


  }
  catch(error){
    return res.status(500).json({ message: error.message });

  }
}
// emergencyController.js
export const fulfillEmergencyRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await EmergencyRequest.findOneAndUpdate(
      { _id: id, hospitalId: req.user._id }, // ← only this hospital can fulfill its own request
      { status: 'Fulfilled' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Request not found or unauthorized" });
    }

    res.status(200).json({ message: "Request fulfilled", data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmergencyRequest = async (req, res) => {
  const { city } = req.query;

  try {
    const query = { status: "Pending" }; // ← only show pending to donors

    if (city) {
      // ✅ case-insensitive match — "kathmandu" matches "Kathmandu"
      query.hospitalCity = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    const emergency = await EmergencyRequest.find(query).sort({ createdAt: -1 });
    res.status(200).json({ data: emergency });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const submitDonationResponse = async (req, res) => {
  try {
    const { emergencyRequestId, message } = req.body;

    if (!emergencyRequestId) {
      return res.status(400).json({ message: "Emergency request ID is required" });
    }

    // Check if donor already responded to this request
    const alreadyResponded = await DonationResponse.findOne({
      emergencyRequestId,
      donorId: req.user._id,
    });

    if (alreadyResponded) {
      return res.status(400).json({ message: "You have already responded to this request" });
    }

   
    const emergency = await EmergencyRequest.findById(emergencyRequestId);
    if (!emergency) {
      return res.status(404).json({ message: "Emergency request not found" });
    }

    const response = await DonationResponse.create({
      emergencyRequestId,
      donorId: req.user._id,
      donorName: req.user.userName,
      donorBloodGroup: req.user.bloodGroup,
      donorPhone: req.user.phoneNumber,
      donorCity: req.user.city,
      message,
      hospitalId: emergency.hospitalId,
      hospitalName: emergency.hospitalName,
    });

    res.status(201).json({
      message: "Response submitted successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};