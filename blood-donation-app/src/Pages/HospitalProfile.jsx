import {
  Building2, Pen, ShieldCheck, MapPin, Phone, Mail,
  BookText, User, LogOut, Hash, Layers, ClipboardList
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function HospitalProfile() {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);

  const logOut = async () => {
    await axios.post("http://localhost:8000/logout", {}, { withCredentials: true });
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await axios.get("http://localhost:8000/profile", {
          withCredentials: true,
        });
        setHospital(res.data);
        console.log("Logged-in hospital:", res.data);
      } catch (err) {
        console.error("Error fetching hospital profile:", err);
      }
    };
    fetchHospital();
  }, []);

  if (!hospital) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 ubuntu-regular gap-5 flex flex-col justify-start items-center md:justify-start">

      {/* 1. Profile Header */}
      <div className="flex justify-center items-center py-5 flex-col border-b-2 border-b-gray-400 w-full">
        <div className="flex flex-col items-center justify-center h-24 w-24 bg-blue-200 rounded-full border-5 border-blue-400 cursor-pointer">
          <Building2 size={50} className="text-blue-600" />
        </div>
        <div className="mt-2">
          <h1 className="font-extrabold text-xl text-center">
            {hospital.hospitalName || '......'}
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="bg-blue-500 text-white rounded-xl px-6 py-1 mt-1 font-bold text-sm">
            Reg No: {hospital.registrationNumber || '......'}
          </span>
          <div className="flex flex-row mt-2 items-center justify-center gap-3">
            <div className="border border-gray-400 rounded-xl hover:bg-gray-200 flex flex-row items-center justify-center cursor-pointer p-2">
              <Pen size={20} />
              <button className="pl-1 cursor-pointer">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Verification Status */}
      <div className="rounded-xl p-4 w-80 border bg-blue-50 border-blue-400">
        <div className="flex flex-row gap-1">
          <ShieldCheck className="text-blue-600" />
          <h1 className="font-bold text-blue-700">Verified Hospital ✅</h1>
        </div>
        <p className="text-sm mt-1 text-gray-600">
          This hospital is registered and verified in the blood donation network.
        </p>
      </div>

      {/* 3. Trust Indicators */}
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
          <ShieldCheck className="text-green-500" />
          <p className="text-green-500 font-bold">Registration Verified</p>
        </div>
      </div>

      {/* 4. Hospital Information */}
      <div className="flex flex-col gap-2 rounded-xl border border-gray-400 w-90">
        <div className="font-bold border-b border-gray-400 w-full p-3 flex flex-row gap-1">
          <BookText />
          <h1>Hospital Information</h1>
        </div>
        <div className="p-3 flex flex-col gap-3">

          <div>
            <div className="flex flex-row gap-1">
              <Hash className="text-black" />
              <h1 className="font-bold text-black">REGISTRATION NUMBER</h1>
            </div>
            <p className="px-7 text-gray-500 font-medium">
              {hospital.registrationNumber || '................'}
            </p>
          </div>

          <div>
            <div className="flex flex-row gap-1">
              <Phone className="text-black" />
              <h1 className="font-bold text-black">HOSPITAL PHONE</h1>
            </div>
            <p className="px-7 text-gray-500 font-medium">
              {hospital.phoneNumber || '................'}
            </p>
          </div>

          <div>
            <div className="flex flex-row gap-1">
              <Mail className="text-black" />
              <h1 className="font-bold text-black">EMAIL</h1>
            </div>
            <p className="px-7 text-gray-500 font-medium">
              {hospital.email || '................'}
            </p>
          </div>

          <div>
            <div className="flex flex-row gap-1">
              <MapPin className="text-black" />
              <h1 className="font-bold text-black">ADDRESS</h1>
            </div>
            <p className="px-7 text-gray-500 font-medium">
              {hospital.streetAddress || '................'}
            </p>
          </div>

          <div>
            <div className="flex flex-row gap-1">
              <Layers className="text-black" />
              <h1 className="font-bold text-black">PROVINCE / DISTRICT / CITY</h1>
            </div>
            <p className="px-7 text-gray-500 font-medium">
              {hospital.province || '...'} / {hospital.district || '...'} / {hospital.city || '...'}
            </p>
          </div>

        </div>
      </div>

      {/* 5. Contact Person Info */}
      <div className="flex flex-col gap-2 rounded-xl border border-gray-400 w-90">
        <div className="font-bold border-b border-gray-400 w-full p-3 flex flex-row gap-1">
          <User />
          <h1>Contact Person</h1>
        </div>
        <div className="p-3 flex flex-col gap-3">

          <div>
            <div className="flex flex-row gap-1">
              <User className="text-black" />
              <h1 className="font-bold text-black">CONTACT PERSON NAME</h1>
            </div>
            <p className="px-7 text-gray-500 font-medium">
              {hospital.contactPersonName || '................'}
            </p>
          </div>

          <div>
            <div className="flex flex-row gap-1">
              <Phone className="text-black" />
              <h1 className="font-bold text-black">CONTACT PERSON NUMBER</h1>
            </div>
            <p className="px-7 text-gray-500 font-medium">
              {hospital.contactPersonNumber || '................'}
            </p>
          </div>

        </div>
      </div>

      {/* 6. Account Info */}
      <div className="flex flex-col gap-2 rounded-xl border border-gray-400 w-90">
        <div className="font-bold border-b border-gray-400 w-full p-3 flex flex-row gap-1">
          <ClipboardList />
          <h1>Account Info</h1>
        </div>
        <div className="p-3 flex flex-col gap-3">

          <div>
            <h1 className="font-bold text-black px-1">ACCOUNT CREATED</h1>
            <p className="px-1 text-gray-500 font-medium">
              {hospital.createdAt
                ? new Date(hospital.createdAt).toLocaleDateString()
                : '................'}
            </p>
          </div>

          <div>
            <h1 className="font-bold text-black px-1">LAST UPDATED</h1>
            <p className="px-1 text-gray-500 font-medium">
              {hospital.updatedAt
                ? new Date(hospital.updatedAt).toLocaleDateString()
                : '................'}
            </p>
          </div>

          <div>
            <h1 className="font-bold text-black px-1">ROLE</h1>
            <p className="px-1 text-gray-500 font-medium capitalize">
              {hospital.role || '................'}
            </p>
          </div>

        </div>
      </div>

      {/* 7. Logout */}
      <div className="border bg-gray-200 border-gray-400 rounded-xl hover:bg-gray-400 flex flex-row items-center justify-center px-4 py-2 m-5 cursor-pointer font-bold">
        <LogOut />
        <button onClick={logOut} className="cursor-pointer">Logout</button>
      </div>

    </div>
  );
}