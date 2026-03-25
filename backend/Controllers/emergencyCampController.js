import EmergencyRequest from "../Models/emergencyModel.js";
import DonationResponse from "../Models/emergencyDonationModel.js"


import mongoose from "mongoose";


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

export const getDonationResponsesWithDetails = async (req, res) => {
  try {
    // 2. Convert string ID from req.user into a MongoDB ObjectId
    const hospitalObjectId = new mongoose.Types.ObjectId(req.user._id);

    const responses = await DonationResponse.aggregate([
      {
        // 3. Move $match to the TOP for performance (Filter before Joining)
        $match: { hospitalId: hospitalObjectId } 
      },
      {
        $lookup: {
          from: "emergencyrequests", // Double-check this is the lowercase plural name in your DB
          localField: "emergencyRequestId",
          foreignField: "_id",
          as: "requestDetails"
        }
      },
      {
        $unwind: "$requestDetails"
      },
      {
        $project: {
          _id: 1,
          donorName: 1,
          donorBloodGroup: 1,
          donorPhone: 1,
          message: 1,
          status: 1,
          createdAt: 1,
          // Extracting fields from the joined requestDetails
          patientName: "$requestDetails.patientName",
          requiredBloodType: "$requestDetails.bloodType",
          hospitalName: "$requestDetails.hospitalName"
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
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
      // case-insensitive match — "kathmandu" matches "Kathmandu"
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

export const submitEmergencyDonationResponse = async (req, res) => {
  try {
    const {
      emergencyRequestId,
      donorId,
      donorName,
      donorEmail,
      bloodGroup,
      unitsDonated = 1,
      message = ""
    } = req.body;

    if (!emergencyRequestId || !donorId) {
      return res.status(400).json({ message: "EmergencyRequestId and donorId are required" });
    }

    const request = await EmergencyRequest.findById(emergencyRequestId);
    if (!request) {
      return res.status(404).json({ message: "Emergency request not found" });
    }

    // Check if donor has already responded
    const existingResponse = request.respondedBy.find(
      (r) => r.donorId.toString() === donorId
    );

    if (existingResponse) {
      // Update existing response
      existingResponse.unitsDonated += unitsDonated;
      existingResponse.timesDonated += 1;
      if (message) existingResponse.message = message;
      existingResponse.respondedAt = new Date();
    } else {
      // Add new response
      request.respondedBy.push({
        donorId,
        donorName,
        donorEmail,
        bloodGroup,
        unitsDonated,
        message,
        timesDonated: 1,
        respondedAt: new Date(),
      });
    }

    await request.save();

    return res.status(200).json({
      message: "Response recorded successfully",
      respondedBy: request.respondedBy,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};