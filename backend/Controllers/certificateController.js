import { Donor } from "../Models/User.js";
import CampRegistration from "../Models/RegisterCamp.js";
import { Camp } from "../Models/Camp.js";


// GET last completed camp for logged-in donor
export const getLastCamp = async (req, res) => {
  try {
    const donorId = req.user._id;

    const registration = await CampRegistration.findOne({
      donorId,
      registrationStatus: "Completed",
    }).sort({ updatedAt: -1 }); // most recent completed

    if (!registration) {
      return res.status(404).json({ message: "No completed donation found" });
    }

    const camp = await Camp.findById(registration.campId);
    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    res.status(200).json(camp);
  } catch (err) {
    console.error("getLastCamp error:", err);
    res.status(500).json({ message: "Error fetching last camp" });
  }
};

// POST upload certificate PNG and save path in donor
export const uploadCertificate = async (req, res) => {
  try {
    const { donorId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const certificatePath = `/uploads/certificates/${req.file.filename}`;

    const donor = await Donor.findByIdAndUpdate(
      donorId,
      { certificate: certificatePath },
      { new: true }
    );

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json({ message: "Certificate saved!", certificatePath });
  } catch (error) {
    console.error("uploadCertificate error:", error);
    res.status(500).json({ message: "Failed to upload certificate" });
  }
};

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