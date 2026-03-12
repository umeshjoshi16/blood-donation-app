
import CampRegistration from "../Models/RegisterCamp.js";
import { Donor } from "../Models/User.js";

// import { generateCertificate } from "../Utils/generateCertificate.js";

export const markAttendance = async (req, res) => {
  try {
    let { registrationIds } = req.body;

    if (!registrationIds || registrationIds.length === 0) {
      return res.status(400).json({ message: "Please select donor" });
    }

    if (!Array.isArray(registrationIds)) {
      registrationIds = [registrationIds];
    }

    const today = new Date();
    let updatedCount = 0;

    for (const id of registrationIds) {

      const registration = await CampRegistration.findOneAndUpdate(
        { _id: id, registrationStatus: {
           $ne: "Completed" } },
        { $set: { registrationStatus: "Completed" } },
        { new: true }
      );

      if (!registration) continue;

      // Get donor data
      const donor = await Donor.findById(registration.donorId);

      if (!donor) continue;

      // Update donor donation info
      donor.donatedBlood = (donor.donatedBlood || 0) + 1;
      donor.lastDonated = today; 
     

      //    try {
      //   const certificatePath = await generateCertificate(donor);
      //   if (certificatePath) donor.certificate = certificatePath;
      // } catch (err) {
      //   console.log("Certificate generation failed:", err);
      // }

      await donor.save();
      updatedCount++;
    }

    if (updatedCount === 0) {
      return res.status(400).json({
        message: "No new attendance to mark. All already completed."
      });
    }

    res.status(200).json({
      message: "Attendance updated and certificates generated",
      updatedCount
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error marking attendance" });
  }
};