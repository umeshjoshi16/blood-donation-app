import { Donor } from "../Models/User.js";


export const getActiveDonors = async (req, res) => {
  try {
    const donors = await Donor.find({ donatedBlood: { $gt: 0 } })
      .select("-password")
      .sort({ donatedBlood: -1 })
      .lean();

    const today = new Date();

    const result = donors.map(d => {
      let isEligible             = false;
      let daysSinceLastDonation  = null;

      if (d.lastDonated) {
        const last            = new Date(d.lastDonated);
        daysSinceLastDonation = Math.floor((today - last) / (1000 * 60 * 60 * 24));
        isEligible            = daysSinceLastDonation > 90;
      }

      return {
        _id:                  d._id,
        userName:             d.userName,
        email:                d.email,
        phoneNumber:          d.phoneNumber,
        bloodGroup:           d.bloodGroup,
        lastDonated:          d.lastDonated,
        donatedBlood:         d.donatedBlood,
        city:                 d.city,
        daysSinceLastDonation,
        isEligible,
        eligibilityStatus:    isEligible ? 'Eligible' : 'Not Eligible',
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};