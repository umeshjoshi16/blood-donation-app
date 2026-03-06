import {Camp} from "../Models/Camp.js";

export const getDonorDashboard = async (req, res) => {
  try {
    const donor = req.user; 
    if (donor.role !== "donor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const city = donor.city;

  const camps = await Camp.find({
  city: donor.city,
  date: { $gte: new Date() }
});

     res.status(200).json({
      success: true,
      donorProfile: donor,
      data: camps
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};