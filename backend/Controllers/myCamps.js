// Controllers/myCamps.js
import { Camp } from "../Models/Camp.js";

export const getMyCamps = async (req, res) => {
  try {
    // Check that the hospital user is logged in
    console.log("Logged in hospital user:", req.user);

    const hospitalName = req.user.hospitalName;
    console.log("Hospital name used for query:", hospitalName);

    // Safer query to ignore case and extra spaces
    const camps = await Camp.find({
      hospitalName: { $regex: `^${hospitalName.trim()}$`, $options: "i" }
    }).sort({ date: 1 });

    console.log("Camps found:", camps.length);

    res.status(200).json({
      message: "Camps fetched successfully",
      camps,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching camps",
    });
  }
};