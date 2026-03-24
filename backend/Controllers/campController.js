import {Camp } from '../Models/Camp.js';


export const scheduleCamp = async (req, res) => {
  try {
    const {
      campTitle,
      campDescription,
      province,
      district,
      city,
      streetAddress,
      date,
      startTime,
      endTime,
      expectedDonors,
      coordinatorName,
      coordinatorContact
    } = req.body;

    console.log("Logged in hospital user:", req.user);

    // Validate input
    if (
      !campTitle || !campDescription || !province || !district ||
      !city || !streetAddress || !date || !startTime ||
      !endTime || !expectedDonors || !coordinatorName || !coordinatorContact
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create camp
    const camp = await Camp.create({
      campTitle,
      campDescription,
      province,
      district,
      city,
      streetAddress,
      date,
      startTime,
      endTime,
      expectedDonors,
      coordinatorName,
      coordinatorContact,

      hospitalName: req.user.hospitalName,
      hospitalProvince: req.user.province,
      hospitalDistrict: req.user.district,
      hospitalCity: req.user.city,
      hospitalId: req.user._id,   // <-- FIXED
    });

    res.status(200).json({
      message: "Camp registered successfully",
      data: camp
    });

  } catch (error) {
    console.error("ERROR IN SCHEDULE CAMP:", error);
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};



export const getCamp = async (req, res) => {
  try {
    const { city } = req.query; 

    const camps = city
      ? await Camp.find({ city })
      : await Camp.find();

    res.status(200).json({ data: camps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
