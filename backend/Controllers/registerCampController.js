import CampRegistration from "../Models/RegisterCamp.js";
import { Camp } from "../Models/Camp.js";

export const registerForCamp = async (req, res) => {
  try {
    const {
      name,
      dateOfBirth,
      gender,
      bloodGroup,
      phoneNumber,
      email,
      province,
      district,
      city,
      weight,
      lastDonated,
      previousDonor,
      recentFever,
      recentTattoo,
      alcoholLast24h,
      consent,
      campId,
      donorId
    } = req.body;
    console.log("Incoming registration data:", req.body);

    if (!consent) {
      return res.status(400).json({
        message: "Consent is required to register."
      });
    }

    if (weight < 45) {
      return res.status(400).json({
        message: "Donor must weigh at least 45kg."
      });
    }

    if (!donorId) return res.status(400).json({ message: "Donor ID is required." });
if (!campId) return res.status(400).json({ message: "Camp ID is required." });

    // check last donation gap
   const lastDonationDate = lastDonated && lastDonated !== "" ? new Date(lastDonated) : null;

    if (lastDonationDate) {
      const now = new Date();
      const diffMonths =
        (now.getFullYear() - lastDonationDate.getFullYear()) * 12 +
        (now.getMonth() - lastDonationDate.getMonth());

      if (diffMonths < 3) {
        return res.status(400).json({
          message: "You must wait at least 3 months between donations."
        });
      }
    }

    if (recentFever || recentTattoo || alcoholLast24h) {
      return res.status(400).json({
        message:
          "You are temporarily ineligible due to health restrictions."
      });
    }

    // check camp exists
    const camp = await Camp.findById(campId);
    if (!camp) {
      return res.status(404).json({
        message: "Camp not found."
      });
    }

    // check duplicate registration
    const existing = await CampRegistration.findOne({
      campId: campId,
      donorId: donorId
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already registered for this camp."
      });
    }

  // create registration safely
const registrationData = {
  donorId,
  campId,
  name,
  dateOfBirth,
  gender,
  bloodGroup,
  phoneNumber,
  email,
  province,
  district,
  city,
  weight,
  previousDonor,
  recentFever,
  recentTattoo,
  alcoholLast24h,
  consent
};

if (lastDonationDate) {
  registrationData.lastDonated = lastDonationDate;
}

const registration = new CampRegistration(registrationData);
await registration.save();

    // update camp count
    camp.registeredCount = (camp.registeredCount || 0) + 1;
    await camp.save();

    res.status(201).json({
      message: "Registration successful!",
      registration
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error during registration."
    });
  }
};