import { Camp }         from "../Models/Camp.js";
import CampRegistration from "../Models/RegisterCamp.js"; 
import DonationResponse from "../Models/emergencyDonationModel.js"; 
import EmergencyRequest from "../Models/emergencyModel.js"; 
import { Donor, Hospital, Organization } from "../Models/User.js"; 

export const getCamps = async (req, res) => {
  try {
    const camps = await Camp.find().sort({ createdAt: -1 }).lean();
    res.json(camps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCampRegistrations = async (req, res) => {
  try {
    const regs = await CampRegistration.find()
      .populate("donorId", "userName email phoneNumber bloodGroup city")
      .populate("campId",  "campTitle date city status")
      .sort({ createdAt: -1 })
      .lean();
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDonationResponses = async (req, res) => {
  try {
    const responses = await DonationResponse.find()
      .populate("donorId",           "userName email phoneNumber bloodGroup city")
      .populate("emergencyRequestId","patientName bloodType units status hospitalName")
      .sort({ createdAt: -1 })
      .lean();
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDonors = async (req, res) => {
  try {
    const donors = await Donor.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};