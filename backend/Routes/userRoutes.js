// import express from'express';
// import{registerUser,loginUser} from'../Controllers/userController.js';
// import {  getDataController}from'../Controllers/getDataController.js';
// import authMiddleware from '../Middlewares/authMiddleware.js';
// import { scheduleCamp,getCamp } from '../Controllers/campController.js';
// import{getDonorDashboard } from "../Controllers/donorDashboard.js"
// import{registerForCamp} from'../Controllers/registerCampController.js';
// import {getMyCamps} from '../Controllers/myCamps.js';
// import { getCampDonors } from "../Controllers/getCampDonors.js";
// import { markAttendance } from "../Controllers/markAttendance.js";

// const router=express.Router();


// router.post("/register", registerUser); 
// router.post("/login", loginUser);       
// router.get('/profile',authMiddleware,getDataController);
// router.get("/dashboard-donor", authMiddleware, getDonorDashboard);
// router.post("/dashboard-donor/register-camp", registerForCamp);
// // router.get('/dasboard-hospital')
// // router.post('/dasboard-hospital/emergency-request')
// router.post('/dashboard-hospital/blood-camp',authMiddleware,scheduleCamp)
// router.get('/dashboard-hospital/blood-camp/my-camps',authMiddleware,getMyCamps);
// router.get('/dashboard-hospital/donor-list', getCamp)

// router.post(
// "/dashboard-hospital/blood-camp/camp-donors",
// authMiddleware,getCampDonors);

// router.post(
// "/dashboard-hospital/blood-camp/mark-attendance",authMiddleware,markAttendance);

 
// export default router;


import express from'express';
import axios from 'axios';


import{registerUser,loginUser} from'../Controllers/userController.js';
import {  getDataController}from'../Controllers/getDataController.js';
import authMiddleware from '../Middlewares/authMiddleware.js';
import { scheduleCamp,getCamp } from '../Controllers/campController.js';
import{getDonorDashboard } from "../Controllers/donorDashboard.js"
import{registerForCamp} from'../Controllers/registerCampController.js';
import {getMyCamps} from '../Controllers/myCamps.js';
import { getCampDonors } from "../Controllers/getCampDonors.js";
import { markAttendance } from "../Controllers/markAttendance.js";
import { uploadCertificate, getLastCamp,getDonationHistory } from "../Controllers/certificateController.js"; 
import { fulfillEmergencyRequest, emergencyRequest,getEmergencyRequest,submitDonationResponse} from '../Controllers/emergencyCampController.js';
import { getActiveDonors } from "../Controllers/getEligibleDonor.js";
import {
  getCamps,
  getCampRegistrations,
  getDonationResponses,
  getDonors,
  getHospitals,
  getOrganizations,
} from "../Controllers/dashboardController.js";
import multer from "multer";
import fs from "fs";



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/certificates";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `certificate_${req.body.donorId}_${Date.now()}.png`);
  },
});
const upload = multer({ storage });

const router=express.Router();
const ML_API = 'http://localhost:5001';

router.post("/register", registerUser); 
router.post("/login", loginUser); 
router.get("/camps",             authMiddleware, getCamps);
router.get("/campregistrations", authMiddleware, getCampRegistrations);
router.get("/donationresponses", authMiddleware, getDonationResponses);
router.get("/donors",            authMiddleware, getDonors);
router.get("/hospitals",         authMiddleware, getHospitals);
router.get("/organizations",     authMiddleware, getOrganizations);      
router.get('/profile', authMiddleware, getDataController);
router.get("/dashboard-donor", authMiddleware, getDonorDashboard);
router.post("/dashboard-donor/register-camp", registerForCamp);
router.post('/dashboard-hospital/blood-camp', authMiddleware, scheduleCamp);
router.get('/dashboard-hospital/blood-camp/my-camps', authMiddleware, getMyCamps);
router.get('/dashboard-hospital/donor-list', getCamp);
router.post("/dashboard-hospital/blood-camp/camp-donors", authMiddleware, getCampDonors);
router.post("/dashboard-hospital/blood-camp/mark-attendance", authMiddleware, markAttendance);
router.post("/dashboard-hospital/emergency-request",authMiddleware,emergencyRequest)
router.get("/active-donors", authMiddleware, getActiveDonors);

// New certificate routes
router.get("/donor/last-camp", authMiddleware, getLastCamp);
router.post("/donor/upload-certificate", authMiddleware, upload.single("certificate"), uploadCertificate);
router.get("/donor/donation-history", authMiddleware, getDonationHistory);
router.get("/emergency-requests", getEmergencyRequest);
router.post("/donation-response", authMiddleware, submitDonationResponse);

router.put(
  "/emergency-requests/:id/fulfill",
  authMiddleware,
  fulfillEmergencyRequest
);


router.post('/score-emergency-donors', async (req, res) => {
  try {
    const { hospital_city, blood_group_needed, donors } = req.body;

    // Step 1 — get donation history from CSV via Flask
    const emails = donors.map(d => d.email).filter(Boolean);

    const { data: historyMap } = await axios.post(`${ML_API}/donor-history`, {
      emails
    });
    // historyMap = { "ram@gmail.com": { months_since_first_donation, number_of_donation, pints_donated, blood_group } }

    // Step 2 — attach history to each donor
    const enrichedDonors = donors.map(d => {
      const history = historyMap[d.email] || null;
      return {
        email:                        d.email      || '',
        username:                     d.username   || '',
        blood_group:                  history?.blood_group || d.bloodGroup || 'O+',
        months_since_first_donation:  history?.months_since_first_donation ?? 0,
        number_of_donation:           history?.number_of_donation          ?? 0,
        pints_donated:                history?.pints_donated               ?? 0,
        found_in_csv:                 !!history,
      };
    });

    // Step 3 — send to Flask ML model for scoring
    const { data: mlResult } = await axios.post(`${ML_API}/predict-batch`, {
      hospital_city,
      blood_group_needed,
      donors: enrichedDonors,
    });

    res.json(mlResult);

  } catch (err) {
    console.error('score-emergency-donors error:', err.message);
    res.status(500).json({ error: err.message });
  }
});




export default router;