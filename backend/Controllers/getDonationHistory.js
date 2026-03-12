import { Camp } from '../Models/Camp.js';
import {CampRegistration} from '../Models/RegisterCamp.js';

export const getDonationHistory = async (req, res) => {
  try {
    const donorId = req.user._id;

    const registrations = await CampRegistration.find({
      donorId,
      registrationStatus: "Completed",
    }).sort({ updatedAt: -1 });

    if (!registrations.length) {
      return res.status(200).json([]);
    }

    const history = await Promise.all(
      registrations.map(async (reg) => {
        const camp = await Camp.findById(reg.campId);
        return {
          date: reg.updatedAt,
          location: camp ? `${camp.streetAddress}, ${camp.city}` : "Unknown",
          hospitalName: camp ? camp.hospitalName : "Unknown",
        };
      })
    );

    res.status(200).json(history);
  } catch (err) {
    console.error("getDonationHistory error:", err);
    res.status(500).json({ message: "Error fetching donation history" });
  }
};