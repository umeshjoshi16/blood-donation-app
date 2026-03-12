import EmergencyRequest from "../Models/emergencyModel.js";


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



export const getEmergencyRequest=async(req,res)=>{
    const { city } = req.query; 

  try{
     const emergency= city
     ? await EmergencyRequest.find({  hospitalCity: city  })
     : await EmergencyRequest.find();
     res.status(200).json({ data: emergency});

  }
  catch(error){
    res.status(500).json({ message: error.message });

  }
}