import { User, Pen, Dot, CircleCheckBig, ShieldCheck, Droplets, Calendar, Mail, MapPin, Phone, Activity, History, ScanHeart, BookText, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Certificate from "./Certificate";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lastCamp, setLastCamp] = useState(null);
  const[eligible,setEligible]=useState(" ");
  const [donorLevel, setDonorLevel] = useState("");
  const [showCertificate, setShowCertificate] = useState(false); 
  const [donationHistory, setDonationHistory] = useState([]);

  const logOut = async () => {
    await axios.post("http://localhost:8000/logout", {}, { withCredentials: true });
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/profile", {
          withCredentials: true,
        });
        setUser(res.data);
        console.log("Logged-in user:", res.data);
         try {
  const historyRes = await axios.get("http://localhost:8000/donor/donation-history", {
    withCredentials: true,
  });
  setDonationHistory(historyRes.data);
} catch (err) {
  console.log("No donation history found",err);
}

        if (res.data.lastDonated) {
        const today = new Date();
        const lastDonated = new Date(res.data.lastDonated);
        const diffMs = today - lastDonated;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
       
        if (diffDays >= 90) {
          setEligible("Eligible to donate ✅");
        } else {
          setEligible(`Not eligible — ${90 - diffDays} days remaining`);
        }
      } else {
        // never donated before → eligible
        setEligible("Eligible to donate ✅");
      }
      const donations = res.data.donatedBlood || 0;
let level = "";
if (donations === 0) {
  level = "New Donor";
} else if (donations < 5) {
  level = "Active Donor";
} else {
  level = "Veteran Donor";
}
setDonorLevel(level);
     
        if (res.data.donatedBlood > 0) {
          try {
            const campRes = await axios.get("http://localhost:8000/donor/last-camp", {
              withCredentials: true,
            });
            setLastCamp(campRes.data);
          } catch (err) {
            console.log("No completed camp found");
          }
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

    
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-lg">Loading profile...</p>
      </div>
    );
  }

  const HistoryRow = ({ date, loc, type }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-gray-900 font-medium">{date}</td>
      <td className="px-6 py-4 text-gray-600">{loc}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded text-xs font-bold ${type === 'Emergency' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
          {type}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12 ubuntu-regular gap-5 flex flex-col justify-start items-center md:justify-start">

      {/* 1. Profile Header */}
      <div className="flex justify-center items-center py-5 flex-col border-b-2 border-b-gray-400 w-full">
        <div className="flex flex-col items-center justify-center h-24 w-24 bg-red-200 rounded-full border-5 border-green-400 cursor-pointer">
          <User size={50} className="text-red-600" />
        </div>
        <div>
          <h1 className="font-extrabold text-xl">Welcome, {user.userName || '......'}</h1>
        </div>
        <div className="flex flex-col justify-center">
          <button className="bg-red-500 text-white rounded-xl w-85 cursor-pointer hover:bg-red-700">
            {user.bloodGroup || '......'} ve
          </button>
          <h1>Last Donated Date: {user.lastDonated ? new Date(user.lastDonated).toLocaleDateString() : '.............'}</h1>
          <div className="flex flex-row mt-2  items-center justify-center gap-3">
            
            <div className="border border-gray-400 rounded-xl hover:bg-gray-200 flex flex-row items-center justify-center cursor-pointer p-2">
              <Pen size={20} />
              <button className="pl-1 cursor-pointer ">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>

     {/* 2. Eligibility */}
<div className={`rounded-xl p-4 w-80 border ${eligible.includes("Not") ? "bg-red-100 border-red-500" : "bg-green-200 border-green-500"}`}>
  <div className="flex flex-row gap-1">
    <CircleCheckBig className={eligible.includes("Not") ? "text-red-600" : "text-green-600"} />
    <h1 className={`font-bold ${eligible.includes("Not") ? "text-red-700" : "text-green-700"}`}>
      {eligible}
    </h1>
  </div>
  <p className="text-sm mt-1">
    {eligible.includes("Not")
      ? "Please wait before your next donation."
      : "You are healthy and within the time window to save a life today!"}
  </p>
</div>
      {/* 3. Trust */}
      <div className="flex flex-col gap-2 rounded-xl border border-gray-400 w-90 p-3">
        <h1 className="font-bold">Trust Indicators</h1>
        <div className="flex flex-row gap-1">
          <ShieldCheck className="text-blue-400" />
          <p className="text-blue-400 font-bold">Phone Verified</p>
        </div>
        <div className="flex flex-row gap-1">
          <ShieldCheck className="text-blue-400" />
          <p className="text-blue-400 font-bold">Email Verified</p>
        </div>
        <div className="flex flex-row gap-1">
  <Droplets className={
    donorLevel === "Veteran Donor" ? "text-purple-500" :
    donorLevel === "Active Donor" ? "text-red-400" :
    "text-gray-400"
  } />
  <p className={`font-bold ${
    donorLevel === "Veteran Donor" ? "text-purple-500" :
    donorLevel === "Active Donor" ? "text-red-400" :
    "text-gray-400"
  }`}>
    {donorLevel} — {user.donatedBlood || 0} donation{user.donatedBlood !== 1 ? "s" : ""}
  </p>
</div>
      </div>

      {/* 4. Personal Information */}
      <div className="flex flex-col gap-2 rounded-xl border border-gray-400 w-90">
        <div className="font-bold border-b border-gray-400 w-full p-3 flex flex-row gap-1">
          <BookText />
          <h1>Personal Information</h1>
        </div>
        <div className="p-3">
          <div className="flex flex-row gap-1">
            <Calendar className="text-black" />
            <h1 className="font-bold text-black">AGE/DOB</h1>
          </div>
          <p className="px-7 text-gray-500 font-medium">{user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '................'}</p>

          <div className="flex flex-row gap-1">
            <Phone className="text-black" />
            <h1 className="font-bold text-black">PHONE</h1>
          </div>
          <p className="px-7 text-gray-500 font-medium">{user.phoneNumber || 'Loading...'}</p>

          <div className="flex flex-row gap-1">
            <MapPin className="text-black" />
            <h1 className="font-bold text-black">ADDRESS</h1>
          </div>
          <p className="px-7 text-gray-500 font-medium">{user.city || '...............'}</p>

          <div className="flex flex-row gap-1">
            <Activity className="text-black" />
            <h1 className="font-bold text-black">GENDER</h1>
          </div>
          <p className="px-7 text-gray-500 font-medium">{user.gender || '.............'}</p>

          <div className="flex flex-row gap-1">
            <Mail className="text-black" />
            <h1 className="font-bold text-black">EMAIL</h1>
          </div>
          <p className="px-7 text-gray-500 font-medium">{user.email || '................'}</p>
        </div>
      </div>

      {/* 5. Health and Medical Info */}
      <div className="flex flex-col gap-2 rounded-xl border border-gray-400 w-90">
        <div className="font-bold border-b border-gray-400 w-full p-3 flex flex-row gap-1">
          <ScanHeart />
          <h1>Health and Medical Info</h1>
        </div>
        <div className="px-3">
          <h1 className="px-3 font-bold text-black">WEIGHT</h1>
          <p className="px-3 text-gray-500 font-medium">{user.weight || '..................'}</p>
          <h1 className="px-3 font-bold text-black">SMOKE/ALCOHOL</h1>
          <p className="px-3 text-gray-500 font-medium">{user.smokeAlcohol || '...................'}</p>
          <h1 className="px-3 font-bold text-black">ON MEDICATION</h1>
          <p className="px-3 text-gray-500 font-medium">{user.onMedication || '...................'}</p>
          <h1 className="px-3 font-bold text-black">RECENT ILLNESS</h1>
          <p className="px-3 text-gray-500 font-medium">{user.recentIllness || '...................'}</p>
        </div>
      </div>

    {/* 6. Donation History */}
<div className="flex flex-col gap-2 rounded-xl border border-gray-400 w-90">
  <div className="font-bold border-b border-gray-400 w-full p-3 flex flex-row gap-1">
    <History />
    <h1>Donation History</h1>
  </div>
  <table className="w-full text-left text-sm">
    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
      <tr>
        <th className="px-6 py-3 font-semibold">Date</th>
        <th className="px-6 py-3 font-semibold">Location</th>
        <th className="px-6 py-3 font-semibold">Hospital</th>
      </tr>
    </thead>
    <tbody className="divide-y">
      {donationHistory.length > 0 ? (
        donationHistory.map((item, index) => (
          <HistoryRow
            key={index}
            date={new Date(item.date).toLocaleDateString()}
            loc={item.location}
            type={item.hospitalName}
          />
        ))
      ) : (
        <tr>
          <td colSpan="3" className="px-6 py-4 text-gray-500 text-center">
            No donation history yet
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>



      {/* 7. Certificate Section */}
      {user.donatedBlood > 0 && lastCamp && (
        <div className="flex flex-col gap-2 rounded-xl border border-gray-400 w-90 p-3">
          <h2 className="font-bold border-b border-gray-400 pb-2">Your Certificate</h2>

          {/* 👇 Show button to toggle certificate */}
          {!showCertificate ? (
            <button
              onClick={() => setShowCertificate(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-max font-bold cursor-pointer"
            >
              🎖 View / Generate Certificate
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowCertificate(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-max font-bold cursor-pointer mb-2"
              >
                ✕ Hide Certificate
              </button>
              <Certificate donor={user} camp={lastCamp} />
            </>
          )}

          {/* Show saved certificate download link if exists */}
          {user.certificate && (
            <a
              href={`http://localhost:8000${user.certificate}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-max mt-2"
            >
              📄 View Saved Certificate
            </a>
          )}
        </div>
      )}

      {/* 8. Logout */}
      <div className="border bg-gray-200 border-gray-400 rounded-xl hover:bg-gray-400 flex flex-row items-center justify-center px-4 py-2 m-5 cursor-pointer font-bold">
        <LogOut />
        <button onClick={logOut} className="cursor-pointer">Logout</button>
      </div>

    </div>
  );
}