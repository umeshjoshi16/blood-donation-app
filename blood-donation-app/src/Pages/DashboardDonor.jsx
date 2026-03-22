// import Logo from "../assets/bloodDrop.png";
// import { User, Bell,Droplets, CircleUserRound, Menu,  X,Building2, CheckCircle2, Users, Calendar,Heart, MapPin, ChevronRight,Dot, Clock,Info, Building ,Phone} from 'lucide-react';

// import { useNavigate } from "react-router-dom";
// import { useEffect, useState,useRef } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import MapComponent from "../Components/MapComponent";
// import GetLocation from'../Pages/GetLocation';
// import axios from 'axios';
// import RegisterCamp from "./RegisterCamp";
// import DonateFormModal from "./DonateFormModel";


// const statusConfig = {
//   Upcoming:  { dotClass: "bg-green-400",  label: "Upcoming"  },
//   Ongoing:   { dotClass: "bg-yellow-400", label: "Ongoing"   },
  
// };

// const BLOOD_COMPATIBILITY = {
//   "O-":  ["O-","O+","A-","A+","B-","B+","AB-","AB+"],
//   "O+":  ["O+","A+","B+","AB+"],
//   "A-":  ["A-","A+","AB-","AB+"],
//   "A+":  ["A+","AB+"],
//   "B-":  ["B-","B+","AB-","AB+"],
//   "B+":  ["B+","AB+"],
//   "AB-": ["AB-","AB+"],
//   "AB+": ["AB+"],
// };

// function isCompatible(donorBlood, neededBlood) {
//   return BLOOD_COMPATIBILITY[donorBlood]?.includes(neededBlood) ?? false;
// }
// export default function DashboardDonor() {
  
//   const [notificationOpen, setNotificationOpen] = useState(false);
//   const [camps, setCamps] = useState([]);
//     const [location, setLocation] = useState(null);
//     const [notifications, setNotifications] = useState([]);
//     const [selectedNotif, setSelectedNotif] = useState(null);
// const [respondedIds, setRespondedIds] = useState(new Set());
// const seenIdsRef = useRef(new Set());
    
//     const [selectedCamp, setSelectedCamp] = useState(null); 
//     const [donorProfile, setDonorProfile] = useState(null);
//     const [showRegisterForm, setShowRegisterForm] = useState(false);
//   const navigate = useNavigate();

// useEffect(() => {
//   const getCamps = async () => {
//     try {
//        const res = await axios.get(
//         "http://localhost:8000/dashboard-donor",
//         { withCredentials: true }
//       );
//       console.log(res.data);
//       console.log("Camps:", camps);
// console.log("Length:", camps.length);
//       setCamps(res.data.data || []);
//       if (res.data.donorProfile) {
//         setDonorProfile(res.data.donorProfile);
//       }
      
//     } catch (error) {
//       console.error(error);
//        toast.error("Failed to load camps");
//     }
//   };
//   getCamps();
// }, []);


//  useEffect(() => {
//     navigator.geolocation.getCurrentPosition((pos) => {
//       setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
//     });
//   }, []);

//   useEffect(() => {
//   if (!donorProfile) return;

//   const poll = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/emergency-requests", {
//         params: { city: donorProfile.city },
//         withCredentials: true,
//       });

//       const requests = res.data.data || [];
    

//       requests.forEach((req) => {
//         console.log("--- Checking request ---");
  
//         // Skip if already seen
//         if (seenIdsRef.current.has(req._id)) return;
//         // Skip if not compatible blood type
//         if (!isCompatible(donorProfile.bloodGroup, req.bloodType)) return;
//         // Skip if not pending
//         if (req.status !== "Pending") return;

//         // New unseen emergency — add to notifications
//         seenIdsRef.current.add(req._id);
//         setNotifications(prev => [{
//           id: req._id,
//           hospitalName: req.hospitalName,
//           hospitalCity: req.hospitalCity,
//           patientName: req.patientName,
//           bloodType: req.bloodType,
//           units: req.units,
//           reason: req.reason,
//           createdAt: req.createdAt,
//           read: false,
//         }, ...prev]);
//       });

//     } catch (err) {
//       console.error("Polling error:", err);
//     }
//   };

//   poll(); // run immediately on mount
//   const interval = setInterval(poll, 15000); // then every 15 seconds
//   return () => clearInterval(interval);

// }, [donorProfile]);

//   const notificationClicked = () => setNotificationOpen(prev => !prev);
//   const navigateProfile = () => navigate('/profile');

// const statusConfig = {
//   Upcoming:  { dotClass: "bg-yellow-400",  label: "Upcoming"  },
//   Ongoing:   { dotClass: "bg-green-400", label: "Ongoing"   },
//   Completed: { dotClass: "bg-gray-400",   label: "Completed" },
// };
//   function getCampStatus(camp) {
//   const now = new Date();

//   const campDate = new Date(camp.date);
//   const [startHours, startMinutes] = camp.startTime.split(":").map(Number);
//   const [endHours, endMinutes] = camp.endTime.split(":").map(Number);

  
//   const startTime = new Date(campDate);
//   startTime.setHours(startHours, startMinutes, 0, 0);

//   const endTime = new Date(campDate);
//   endTime.setHours(endHours, endMinutes, 0, 0);

//   if (now < startTime) {
//     return "Upcoming";
//   } else if (now >= startTime && now <= endTime) {
//     return "Ongoing";
//   } else {
//     return "Completed";
//   }
// }
// const unreadCount = notifications.filter(n => !n.read).length;

//   const handleBellClick = () => {
//     setNotificationOpen(prev => !prev);
//     if (!notificationOpen) {
//       setTimeout(() => {
//         setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//       }, 300);
//     }
//   };

//   function timeAgo(dateStr) {
//     const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
//     if (diff < 60) return "Just now";
//     if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
//     return `${Math.floor(diff / 86400)} day ago`;
//   }


//   return (
//     <div className="min-h-screen bg-gray-50 ubuntu-regular relative">
      
      
//       <nav className="z-50 w-full bg-red-100 p-3 sticky top-0 flex items-center shadow-sm border-b border-red-200">
//         <div className="flex items-center gap-2 w-1/2">
//         <Droplets size={30} className="text-red-700"/>
//           <span className="font-bold text-black ubuntu-regular  text-xl  hidden md:inline ">Blood Care</span>
//         </div>

//         <div className='ml-auto flex items-center gap-2 md:gap-4'>
          
//           {/* <div className="cursor-pointer relative hover:bg-red-200 p-2 rounded-full transition" onClick={notificationClicked}>
//             <Bell size={24} className="text-red-800" />
//             <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-red-100"></span>
//           </div> */}
//           <div className="cursor-pointer relative hover:bg-red-200 p-2 rounded-full transition" onClick={handleBellClick}>
//   <Bell size={24} className="text-red-800" />
//   {unreadCount > 0 && (
//     <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-red-100">
//       {unreadCount > 9 ? "9+" : unreadCount}
//     </span>
//   )}
// </div>

//           <div className="cursor-pointer hover:bg-red-200 p-2 rounded-full transition" onClick={navigateProfile}>
//             <CircleUserRound size={24} className="text-red-800" />
//           </div>

          
//         </div>
//       </nav>

     
//       <main>
       
//         <div className="w-full  border-b relative">
//           <MapComponent />
//           <div className="absolute bottom-4 left-4 md:left-100 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-red-200 shadow-sm">
//             <p className="text-xs font-bold text-red-600">LIVE: 12 Hospitals looking for donors nearby</p>
//           </div>
//         </div> 

//         {/*Blood Donation Camps Section */}
//         <section className="max-w-6xl mx-auto p-5 md:p-10">
//           <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//             <div>
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//                 <Calendar className="text-red-600" /> Upcoming Donation Camps
//               </h2>
//               <p className="text-gray-500 mt-1">Register for a camp near you and save lives.</p>
//             </div>
            
//           </div>

//           {/* Camps Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {camps.map(camp => (
//               <div key={camp._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group">
//                 <div className="bg-red-600 p-4 text-white">
//                   <h3 className="font-bold text-xl truncate">{camp.campTitle}</h3>
//                   <h3 className=" text-md text-white/80 truncate">Organized by: {camp.hospitalName}</h3>
//                   <p className="text-xs opacity-90 uppercase tracking-wider">{camp.hospital}</p>
//                 </div>
                
//                 <div className="p-5 space-y-4">
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-3 text-gray-600">
//                       <Calendar size={16} className="text-red-500" />
//                       <span className="text-sm font-medium">{camp.date.split("T")[0]}</span>
//                     </div>
//                     <div className="flex items-center gap-3 text-gray-600">
//                       <Clock size={16} className="text-red-500" />
//                       <span className="text-sm">{camp.startTime} to {camp.endTime}</span>
//                     </div>
//                     <div className="flex items-center gap-3 text-gray-600">
//                       <MapPin size={16} className="text-red-500" />
//                       <span className="text-sm truncate">{camp.streetAddress} , {camp.city} ({camp.district})</span>
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap gap-5 items-center justify-center ">


//                   <button className="w-fit px-5 bg-red-50 text-red-600 py-2.5 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors cursor-pointer" onClick={()=>
//                     setSelectedCamp(camp)
//                   }
//                     >
//                     Details
//                   </button>
              

//                   <button
//   className="w-fit px-5 bg-red-50 text-red-600 py-2.5 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
//   onClick={() => {
//     setSelectedCamp(camp);    
//     setShowRegisterForm(true); 
//   }}
// >
//   Register Now
// </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//   {selectedCamp && (
//   <>
//     {/* Backdrop */}
//     <div
//       className="fixed inset-0 bg-black/30 z-40"
//       onClick={() => setSelectedCamp(null)}
//     />

//     {/* Sidebar */}
//     <div className="fixed right-0 top-0 h-full w-1/2 max-w-150 bg-white shadow-lg z-50 overflow-y-auto">

//       {/* Header */}
//       <div className="bg-red-500 p-6 flex flex-col gap-3">
//         <div className="flex justify-between items-start">
//           <div className="flex items-center gap-3">
//   <Dot size={24} className={statusConfig[getCampStatus(selectedCamp)].dotClass} />
//   <h1 className="text-white font-bold text-xl">
//     {statusConfig[getCampStatus(selectedCamp)].label}
//   </h1>
// </div>
//           <button
//             onClick={() => setSelectedCamp(null)}
//             className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800"
//           >
//             <X size={16}/>
//           </button>
//         </div>

//         <div className="flex items-center gap-3 mt-2">
//           <Droplets size={28} className="text-white" />
//           <h2 className="text-white font-bold text-2xl">{selectedCamp.campTitle}</h2>
//         </div>
//         <p className="text-white/80 text-sm">{selectedCamp.campDescription}</p>
//       </div>

//       {/* Donor Registration */}
//       <div className="p-5 bg-red-100 space-y-4">
//         <div className="border border-red-300 bg-red-50 rounded-xl p-3">
//           <div className="flex items-center gap-2">
//             <Users size={18} className="text-red-600" />
//             <h3 className="font-bold text-red-600">Donor Registration</h3>
//           </div>
//           <p className="text-sm font-medium mt-1">
//             Total Seats: {selectedCamp.expectedDonors} | Registered: {selectedCamp.registeredCount} | Available: {selectedCamp.expectedDonors-selectedCamp.registeredCount}
//           </p>
//         </div>

//         {/* Camp Details */}
//         <div className="space-y-2">
//           <h3 className="font-bold text-lg">CAMP DETAILS</h3>
//           <div className="flex flex-row gap-2 items-start  border border-red-300 bg-red-50 rounded-xl p-3 ">
//             <Calendar className="text-red-600"/>

//             <div >
//               <h1 className="font-bold text-md">DATE</h1>
//               <p>{selectedCamp.date.split("T")[0]}</p>


//             </div>
//           </div>


//           <div className="flex flex-row gap-2 items-start border border-red-300 bg-red-50 rounded-xl p-3 ">
//             <Clock className="text-red-600"/>

//             <div >
//               <h1 className="font-bold text-md">TIME</h1>
//               <p>{selectedCamp.startTime}-{selectedCamp.endTime}</p>


//             </div>
//           </div>

//            <div className="flex flex-row gap-2 items-start border border-red-300 bg-red-50 rounded-xl p-3 ">
//             <MapPin className="text-red-600"/>

//             <div >
//               <h1 className="font-bold text-md">LOCATION</h1>
//               <p>{selectedCamp.streetAddress}-{selectedCamp.city}</p>
//               <p>{selectedCamp.district} District</p>
              


//             </div>
//           </div>

//            <div className="flex flex-row gap-2 items-start border border-red-300 bg-red-50 rounded-xl p-3 ">
//             <User className="text-red-600"/>

//             <div >
//               <h1 className="font-bold text-md">COORDINATOR</h1>
//               <p>{selectedCamp.coordinatorName}</p>
//               <div className="flex flex-row items-center">

             
//                <Phone  size={16}/>
//               <p>{selectedCamp.coordinatorContact} </p>
//                </div>
              


//             </div>
//           </div>



          
          
          
          
//         </div>

//         {/* Hospital */}
//         <div className="space-y-2">
//           <h1 className="font-extrabold">ASSOCIATED HOSPITAL</h1>
//          <div className="flex flex-row gap-2 items-start border border-blue-300 bg-blue-50 rounded-xl p-3 ">
//             <Building className="text-red-600"/>

//             <div >
//               <h1 className="font-bold text-md">HOSPITAL</h1>
//               <p>{selectedCamp.hospitalName}</p>
//               <p>{selectedCamp.hospitalCity} ,{selectedCamp.hospitalDistrict}</p>
              


//             </div>
//           </div>
//         </div>

//         {/* Register Button */}
//         <button className="w-full py-3 mt-4 bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition" onClick={() => {
//   setShowRegisterForm(true);
//   setSelectedCamp(null);
// }}>
//           <Heart size={18} /> Register for this Camp <ChevronRight size={18} />
//         </button>
//       </div>
//     </div>
//   </>
// )}
            

//           </div>
//         </section>
//       </main>

//    {showRegisterForm && donorProfile && selectedCamp && (
//   <RegisterCamp 
//     campId={selectedCamp._id} 
//     donorProfile={donorProfile} 
//     onClose={() => setShowRegisterForm(false)} 
//   />
// )}

//     {/* Notification Dropdown */}
// {notificationOpen && (
//   <div className="fixed md:absolute right-4 top-16 z-100 w-[320px] bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
    
//     {/* Header */}
//     <div className="p-4 bg-red-50 border-b border-red-100 flex justify-between items-center">
//       <div className="flex items-center gap-2">
//         <h3 className="font-medium text-red-800 text-xl ubuntu-regular">Notifications</h3>
//         {unreadCount > 0 && (
//           <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//             {unreadCount} new
//           </span>
//         )}
//       </div>
//       <button onClick={() => setNotificationOpen(false)} className="text-red-400 hover:text-red-800 cursor-pointer">✕</button>
//     </div>

//     {/* List */}
//     <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
//       {notifications.length === 0 ? (
//         <div className="p-8 flex flex-col items-center text-gray-400">
//           <Bell size={32} className="mb-2 opacity-30" />
//           <p className="text-sm">No notifications yet</p>
//           <p className="text-xs mt-1 text-center">Emergency requests matching your blood type will appear here</p>
//         </div>
//       ) : (
//         notifications.map((notif) => (
//           <div
//             key={notif.id}
//            onClick={() => {
//   setNotifications(prev =>
//     prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
//   );
//   setSelectedNotif(notif);//opens the modal
//   setNotificationOpen(false); //closes the dropdown
// }}
//             className={`p-4 flex gap-3 cursor-pointer transition hover:bg-gray-50 ${!notif.read ? "bg-red-50" : "bg-white"}`}
//           >
//             <div className="bg-red-100 p-2 rounded-full h-fit shrink-0">
//               <Droplets size={18} className="text-red-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm text-gray-800 ubuntu-regular">
//                 <span className="font-bold">{notif.hospitalName}</span> needs{" "}
//                 <span className="font-bold text-red-600">{notif.bloodType}</span> blood —{" "}
//                 {notif.units} unit{notif.units > 1 ? "s" : ""}
//               </p>
//               {notif.patientName && (
//                 <p className="text-xs text-gray-500 mt-0.5 truncate">Patient: {notif.patientName}</p>
//               )}
//               {notif.reason && (
//                 <p className="text-xs text-gray-400 truncate">{notif.reason}</p>
//               )}
//               <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.createdAt)}</p>
// {respondedIds.has(notif.id) && (
//   <span className="text-[10px] text-green-600 font-bold mt-0.5 block">✓ Responded</span>
// )}
//             </div>
//             {/* Red dot — disappears when clicked */}
//             {!notif.read && (
//               <span className="w-2.5 h-2.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
//             )}
//           </div>
//         ))
//       )}
//     </div>

//     {/* Footer */}
//     <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
//       <button
//         className="text-xs font-bold text-gray-500 hover:text-red-600 cursor-pointer transition"
//         onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
//       >
//         Mark all as read
//       </button>
//     </div>
//   </div>
// )}
//       {selectedNotif && donorProfile && (
//         <DonateFormModal
//           notification={selectedNotif}
//           donorProfile={donorProfile}
//           onClose={() => setSelectedNotif(null)}
//           onSuccess={(id) => setRespondedIds(prev => new Set([...prev, id]))}
//         />
//       )}
//     </div>
//   );
// }

import {
  Bell, Droplets, CircleUserRound, X,
  CheckCircle2, Users, Calendar, Heart,
  MapPin, ChevronRight, Clock, Building,
  Phone, Activity, AlertCircle, User,
} from 'lucide-react';

import { useNavigate }                    from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import toast, { Toaster }                from 'react-hot-toast';
import axios                             from 'axios';
import RegisterCamp                      from './RegisterCamp';
import DonateFormModal                   from './DonateFormModel';



const API = 'http://localhost:8000';

const BLOOD_COMPATIBILITY = {
  'O-':  ['O-','O+','A-','A+','B-','B+','AB-','AB+'],
  'O+':  ['O+','A+','B+','AB+'],
  'A-':  ['A-','A+','AB-','AB+'],
  'A+':  ['A+','AB+'],
  'B-':  ['B-','B+','AB-','AB+'],
  'B+':  ['B+','AB+'],
  'AB-': ['AB-','AB+'],
  'AB+': ['AB+'],
};

const CAMP_STATUS = {
  Upcoming:  { dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700', label: 'Upcoming'  },
  Ongoing:   { dot: 'bg-green-400',  badge: 'bg-green-100  text-green-700',  label: 'Ongoing'   },
  Completed: { dot: 'bg-gray-300',   badge: 'bg-gray-100   text-gray-500',   label: 'Completed' },
};



const lsGet = (key, fallback) => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
};
const lsSet = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

const notifKey     = id => `bc_notifs_${id}`;
const respondedKey = id => `bc_responded_${id}`;
const seenKey      = id => `bc_seen_${id}`;



const isCompatible = (donorBlood, neededBlood) =>
  BLOOD_COMPATIBILITY[donorBlood]?.includes(neededBlood) ?? false;

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getCampStatus(camp) {
  const now   = new Date();
  const base  = new Date(camp.date);
  const [sh, sm] = camp.startTime.split(':').map(Number);
  const [eh, em] = camp.endTime.split(':').map(Number);
  const start = new Date(base); start.setHours(sh, sm, 0, 0);
  const end   = new Date(base); end.setHours(eh, em, 0, 0);
  if (now < start) return 'Upcoming';
  if (now <= end)  return 'Ongoing';
  return 'Completed';
}



export default function DashboardDonor() {
  const navigate = useNavigate();


  const [camps,            setCamps]            = useState([]);
  const [emergencyList,    setEmergencyList]    = useState([]);   // all fetched emergency requests
  const [donorProfile,     setDonorProfile]     = useState(null);
  const [notifications,    setNotifications]    = useState([]);
  const [respondedIds,     setRespondedIds]     = useState(new Set());
  const [selectedCamp,     setSelectedCamp]     = useState(null);
  const [selectedNotif,    setSelectedNotif]    = useState(null); // opens DonateFormModal
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [notifOpen,        setNotifOpen]        = useState(false);
  const [activeTab,        setActiveTab]        = useState('camps'); // 'camps' | 'emergency' | 'activity'

  const seenIdsRef = useRef(new Set());


  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res     = await axios.get(`${API}/dashboard-donor`, { withCredentials: true });
  //       const profile = res.data.donorProfile;
  //       setCamps(res.data.data || []);

  //       if (profile) {
  //         setDonorProfile(profile);
  //         setNotifications(lsGet(notifKey(profile._id),         []));
  //         setRespondedIds(new Set(lsGet(respondedKey(profile._id), [])));
  //         seenIdsRef.current = new Set(lsGet(seenKey(profile._id), []));
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       toast.error('Failed to load dashboard');
  //     }
  //   })();
  // }, []);
// useEffect 1 — fix this part only
useEffect(() => {
  (async () => {
    try {
      const res     = await axios.get(`${API}/dashboard-donor`, { withCredentials: true });
      const profile = res.data.donorProfile;
      setCamps(res.data.data || []);

      if (profile) {
        setDonorProfile(profile);

        // ── Load from localStorage ──
        const savedNotifs = lsGet(notifKey(profile._id), []);

        // ✅ Mark ALL previously saved notifications as read on login
        // Only NEW ones (from polling) should ever be unread
        const notisAsRead = savedNotifs.map(n => ({ ...n, read: true }));

        setNotifications(notisAsRead);
        setRespondedIds(new Set(lsGet(respondedKey(profile._id), [])));
        seenIdsRef.current = new Set(lsGet(seenKey(profile._id), []));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard');
    }
  })();
}, []);
  useEffect(() => {
    if (!donorProfile) return;
    (async () => {
      try {
        const res      = await axios.get(`${API}/emergency-requests`, {
          params: { city: donorProfile.city },
          withCredentials: true,
        });
        const all = Array.isArray(res.data)
          ? res.data
          : res.data.data ?? res.data.requests ?? [];

        // Show only Pending requests that are blood-compatible
        const relevant = all.filter(
          req => req.status === 'Pending' &&
                 isCompatible(donorProfile.bloodGroup, req.bloodType)
        );
        setEmergencyList(relevant);
      } catch (err) {
        console.error('Emergency fetch error:', err);
      }
    })();
  }, [donorProfile]);

  
  useEffect(() => {
    if (!donorProfile) return;

    const poll = async () => {
      try {
        const res      = await axios.get(`${API}/emergency-requests`, {
            params: donorProfile.city ? { city: donorProfile.city } : {}, 
          withCredentials: true,
        });
        const requests = Array.isArray(res.data)
          ? res.data
          : res.data.data ?? res.data.requests ?? [];

        const toAdd = [];
        requests.forEach(req => {
          if (seenIdsRef.current.has(req._id))                       return;
          if (!isCompatible(donorProfile.bloodGroup, req.bloodType)) return;
          if (req.status !== 'Pending')                              return;

          seenIdsRef.current.add(req._id);
          toAdd.push({
            id:           req._id,
            hospitalName: req.hospitalName,
            hospitalCity: req.hospitalCity,
            patientName:  req.patientName,
            bloodType:    req.bloodType,
            units:        req.units,
            reason:       req.reason,
            createdAt:    req.createdAt,
            read:         false,
          });
        });
// In the polling useEffect — update the lsSet call
if (toAdd.length > 0) {
  setNotifications(prev => {
    const updated = [...toAdd, ...prev];
    
    // ✅ Save to localStorage with new ones unread, but
    // persist the read state correctly for next session
    lsSet(notifKey(donorProfile._id), updated);
    lsSet(seenKey(donorProfile._id),  [...seenIdsRef.current]);
    return updated;
  });
  // ... rest of emergencyList update unchanged
}
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    poll();
    const id = setInterval(poll, 15000);
    return () => clearInterval(id);
  }, [donorProfile]);



  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      if (donorProfile) lsSet(notifKey(donorProfile._id), updated);
      return updated;
    });
  }, [donorProfile]);

  const handleBellClick = () => {
    setNotifOpen(prev => {
      if (!prev) setTimeout(markAllRead, 400);
      return !prev;
    });
  };

  const handleNotifClick = (notif) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === notif.id ? { ...n, read: true } : n);
      if (donorProfile) lsSet(notifKey(donorProfile._id), updated);
      return updated;
    });
    setSelectedNotif(notif);
    setNotifOpen(false);
  };

  const handleResponded = (id) => {
    setRespondedIds(prev => {
      const updated = new Set([...prev, id]);
      if (donorProfile) lsSet(respondedKey(donorProfile._id), [...updated]);
      return updated;
    });
  };

  // Opens DonateFormModal from an emergency card click
  // Converts emergency request doc to the notification shape DonateFormModal expects
  const handleEmergencyCardClick = (req) => {
    setSelectedNotif({
      id:           req._id,
      hospitalName: req.hospitalName,
      hospitalCity: req.hospitalCity,
      patientName:  req.patientName,
      bloodType:    req.bloodType,
      units:        req.units,
      reason:       req.reason,
      createdAt:    req.createdAt,
    });
  };



  const totalDonations = donorProfile?.donatedBlood ?? 0;
  const lastDonated    = donorProfile?.lastDonated;
  const daysSinceLast  = lastDonated
    ? Math.floor((Date.now() - new Date(lastDonated)) / 86400000)
    : null;
  const isEligible    = daysSinceLast !== null ? daysSinceLast > 90 : false;
  const daysUntilNext = !isEligible && daysSinceLast !== null ? 90 - daysSinceLast : 0;
  const upcomingCamps = camps.filter(c => getCampStatus(c) !== 'Completed');


  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

    
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 flex-1">
            <Droplets size={24} className="text-red-600" />
            <span className="font-bold text-gray-800 text-lg hidden sm:inline tracking-tight">
              Blood Care
            </span>
          </div>

          {/* Donor pill */}
          {donorProfile && (
            <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-[11px] font-bold">
                {donorProfile.userName?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{donorProfile.userName}</span>
              <span className="text-xs font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                {donorProfile.bloodGroup}
              </span>
            </div>
          )}

          {/* Bell */}
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
            onClick={handleBellClick}
          >
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => navigate('/profile')}
          >
            <CircleUserRound size={20} className="text-gray-600" />
          </button>
        </div>
      </nav>

      {notifOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
          <div className="fixed right-4 top-14 z-50 w-85 bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden">

            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setNotifOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition text-lg leading-none"
              >✕</button>
            </div>

            <div className="max-h-100 overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <div className="px-4 py-10 flex flex-col items-center text-gray-400 gap-2">
                  <Bell size={28} className="opacity-25" />
                  <p className="text-sm font-medium">No notifications yet</p>
                  <p className="text-xs text-center opacity-70">
                    Matching emergency requests will appear here
                  </p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotifClick(notif)}
                    className={`px-4 py-3 flex gap-3 cursor-pointer hover:bg-gray-50 transition ${
                      !notif.read ? 'bg-red-50/40' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <Droplets size={14} className="text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-snug">
                        <span className="font-semibold">{notif.hospitalName}</span>
                        {' '}needs{' '}
                        <span className="font-bold text-red-600">{notif.bloodType}</span>
                        {' '}— {notif.units} unit{notif.units > 1 ? 's' : ''}
                      </p>
                      {notif.patientName && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          Patient: {notif.patientName}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{timeAgo(notif.createdAt)}</span>
                        {respondedIds.has(notif.id) && (
                          <span className="text-[10px] bg-green-100 text-green-600 font-semibold px-1.5 py-0.5 rounded-full">
                            ✓ Responded
                          </span>
                        )}
                      </div>
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                <button
                  onClick={markAllRead}
                  className="text-xs text-gray-400 hover:text-red-600 font-medium transition"
                >
                  Mark all as read
                </button>
                <span className="text-xs text-gray-300">{notifications.length} total</span>
              </div>
            )}
          </div>
        </>
      )}

     
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-7">

        {/* ── Stat Cards ── */}
        {donorProfile && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              icon={<Droplets size={18} className="text-red-600" />}
              iconBg="bg-red-100"
              value={totalDonations}
              label="Total Donations"
            />
            <StatCard
              icon={<Clock size={18} className="text-blue-600" />}
              iconBg="bg-blue-100"
              value={daysSinceLast !== null ? `${daysSinceLast}d` : '—'}
              label="Since Last Donation"
            />
            <div className={`rounded-2xl border p-4 shadow-sm flex items-center gap-3 col-span-2 md:col-span-1 ${
              isEligible        ? 'bg-green-50  border-green-200'
              : daysSinceLast === null ? 'bg-gray-50 border-gray-200'
              :                         'bg-orange-50 border-orange-200'
            }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isEligible ? 'bg-green-200' : 'bg-orange-100'
              }`}>
                <Activity size={18} className={isEligible ? 'text-green-700' : 'text-orange-500'} />
              </div>
              <div>
                <p className={`text-sm font-bold leading-tight ${isEligible ? 'text-green-700' : 'text-orange-600'}`}>
                  {isEligible ? 'Eligible to Donate'
                    : daysSinceLast === null ? 'No record'
                    : `${daysUntilNext} days remaining`}
                </p>
                <p className={`text-xs mt-0.5 ${isEligible ? 'text-green-500' : 'text-orange-400'}`}>
                  {isEligible ? 'You can donate now' : 'Until next donation'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {[
            { key: 'camps',     label: 'Blood Camps',     icon: <Calendar    size={14} /> },
            { key: 'emergency', label: 'Emergency Needs', icon: <AlertCircle size={14} /> },
            { key: 'activity',  label: 'My Activity',     icon: <Activity    size={14} /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === tab.key
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.key === 'emergency' && emergencyList.length > 0 && (
                <span className="ml-0.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {emergencyList.length > 9 ? '9+' : emergencyList.length}
                </span>
              )}
            </button>
          ))}
        </div>

       
        {activeTab === 'camps' && (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Upcoming Blood Camps</h2>
                <p className="text-xs text-gray-400 mt-0.5">Register at a camp near you</p>
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {upcomingCamps.length} available
              </span>
            </div>

            {upcomingCamps.length === 0 ? (
              <EmptyState icon={<Calendar size={32} />} text="No upcoming camps" sub="Check back soon." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {camps.map(camp => {
                  const status = getCampStatus(camp);
                  const style  = CAMP_STATUS[status];
                  if (status === 'Completed') return null;
                  const pct = Math.min(
                    Math.round((camp.registeredCount / camp.expectedDonors) * 100), 100
                  );
                  return (
                    <div key={camp._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      {/* Header */}
                      <div className="bg-linear-to-br from-red-600 to-red-700 p-4 text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.07]"
                          style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '18px 18px' }}
                        />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${style.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                              {style.label}
                            </span>
                            <span className="text-[11px] text-white/60">
                              {camp.registeredCount}/{camp.expectedDonors}
                            </span>
                          </div>
                          <h3 className="font-bold text-base leading-tight">{camp.campTitle}</h3>
                          <p className="text-white/70 text-xs mt-0.5">by {camp.hospitalName}</p>
                        </div>
                      </div>
                      {/* Body */}
                      <div className="p-4 space-y-3">
                        <div className="space-y-1.5">
                          {[
                            { icon: <Calendar size={13} />, text: camp.date?.split('T')[0] },
                            { icon: <Clock    size={13} />, text: `${camp.startTime} – ${camp.endTime}` },
                            { icon: <MapPin   size={13} />, text: `${camp.streetAddress}, ${camp.city}` },
                          ].map((row, i) => (
                            <div key={i} className="flex items-center gap-2 text-gray-500 text-xs">
                              <span className="text-red-400 shrink-0">{row.icon}</span>
                              <span className="truncate">{row.text}</span>
                            </div>
                          ))}
                        </div>
                        {/* Capacity */}
                        <div>
                          <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                            <span>Seats filled</span><span>{pct}%</span>
                          </div>
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => setSelectedCamp(camp)}
                            className="flex-1 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => { setSelectedCamp(camp); setShowRegisterForm(true); }}
                            className="flex-1 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition"
                          >
                            Register
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

       
        {activeTab === 'emergency' && (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Emergency Blood Requests</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Requests compatible with your blood type ({donorProfile?.bloodGroup}) near {donorProfile?.city}
                </p>
              </div>
              {emergencyList.length > 0 && (
                <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                  {emergencyList.length} pending
                </span>
              )}
            </div>

            {emergencyList.length === 0 ? (
              <EmptyState
                icon={<AlertCircle size={32} />}
                text="No emergency requests right now"
                sub="New requests matching your blood type will appear here."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {emergencyList.map(req => (
                  <div
                    key={req._id}
                    onClick={() => handleEmergencyCardClick(req)}
                    className="bg-white rounded-2xl border border-red-100 overflow-hidden hover:shadow-md hover:border-red-300 transition-all cursor-pointer group"
                  >
                    {/* Header */}
                    <div className="bg-linear-to-br from-red-700 to-red-800 p-4 text-white relative overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.07]"
                        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '18px 18px' }}
                      />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          {/* Blood type badge */}
                          <span className="text-xs font-extrabold bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-full">
                            {req.bloodType}
                          </span>
                          <span className="text-[11px] text-white/60">{timeAgo(req.createdAt)}</span>
                        </div>
                        <h3 className="font-bold text-base leading-tight">{req.hospitalName}</h3>
                        <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                          <MapPin size={11} /> {req.hospitalCity}
                        </p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <User size={13} className="text-red-400 shrink-0" />
                          <span className="font-medium">{req.patientName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <Droplets size={13} className="text-red-400 shrink-0" />
                          <span>{req.units} unit{req.units > 1 ? 's' : ''} required</span>
                        </div>
                        {req.reason && (
                          <p className="text-xs text-gray-400 line-clamp-2 bg-gray-50 rounded-lg px-2.5 py-2 mt-1">
                            {req.reason}
                          </p>
                        )}
                      </div>

                      {/* Status + CTA */}
                      <div className="flex items-center justify-between pt-1">
                        {respondedIds.has(req._id) ? (
                          <span className="text-xs bg-green-100 text-green-600 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={11} /> Responded
                          </span>
                        ) : (
                          <span className="text-xs bg-red-50 text-red-500 font-semibold px-2.5 py-1 rounded-full">
                            Pending
                          </span>
                        )}
                        <span className="text-xs text-red-600 font-semibold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                          Respond <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

       
        {activeTab === 'activity' && (
          <section className="space-y-5">
            <h2 className="text-lg font-bold text-gray-800">My Donation Activity</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Donation Summary */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-4">Donation Summary</h3>
                <div className="space-y-0">
                  {[
                    { label: 'Total Donations',  val: totalDonations,    color: 'text-gray-800' },
                    { label: 'Blood Group',       val: donorProfile?.bloodGroup, color: 'text-red-600' },
                    { label: 'Last Donated',      val: lastDonated ? new Date(lastDonated).toLocaleDateString() : 'Never', color: 'text-gray-800' },
                    { label: 'Days Since Last',   val: daysSinceLast !== null ? `${daysSinceLast} days` : '—', color: 'text-gray-800' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">{row.label}</span>
                      <span className={`text-sm font-bold ${row.color}`}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility */}
              <div className={`rounded-2xl border p-5 space-y-4 ${
                isEligible ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
              }`}>
                <h3 className={`text-sm font-bold ${isEligible ? 'text-green-700' : 'text-orange-700'}`}>
                  Donation Eligibility
                </h3>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    isEligible ? 'bg-green-200' : 'bg-orange-200'
                  }`}>
                    {isEligible ? '✅' : '⏳'}
                  </div>
                  <div>
                    <p className={`text-base font-extrabold ${isEligible ? 'text-green-700' : 'text-orange-700'}`}>
                      {isEligible ? 'You are Eligible!' : `${daysUntilNext} more days`}
                    </p>
                    <p className={`text-xs mt-1 leading-relaxed ${isEligible ? 'text-green-600' : 'text-orange-500'}`}>
                      {isEligible
                        ? 'You can donate blood right now. Find a camp or respond to an emergency.'
                        : `You need to wait ${daysUntilNext} more days before donating again.`}
                    </p>
                  </div>
                </div>

                {!isEligible && daysSinceLast !== null && (
                  <div>
                    <div className="flex justify-between text-[11px] mb-1.5 font-medium text-orange-500">
                      <span>{daysSinceLast} days passed</span>
                      <span>90 required</span>
                    </div>
                    <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full transition-all"
                        style={{ width: `${Math.min((daysSinceLast / 90) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {isEligible && (
                  <button
                    onClick={() => setActiveTab('camps')}
                    className="w-full py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition text-xs tracking-wide"
                  >
                    Find a Camp to Donate →
                  </button>
                )}
              </div>
            </div>

            {/* Response History */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4">Emergency Response History</h3>
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No emergency requests received yet.</p>
              ) : (
                <div className="space-y-2">
                  {notifications.slice(0, 10).map(n => (
                    <div key={n.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-red-600 text-xs bg-red-50 border border-red-100 px-2 py-0.5 rounded-lg">
                          {n.bloodType}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{n.hospitalName}</p>
                          <p className="text-xs text-gray-400">{timeAgo(n.createdAt)}</p>
                        </div>
                      </div>
                      {respondedIds.has(n.id) ? (
                        <span className="text-[11px] bg-green-100 text-green-600 font-semibold px-2.5 py-1 rounded-full">
                          ✓ Responded
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedNotif(n)}
                          className="text-[11px] bg-red-600 text-white font-bold px-3 py-1 rounded-full hover:bg-red-700 transition"
                        >
                          Respond
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* ══════════════════════ CAMP DETAIL SIDEBAR ══════════════════════════ */}
      {selectedCamp && !showRegisterForm && (
        <>
          <div className="fixed inset-0 bg-black/25 z-40" onClick={() => setSelectedCamp(null)} />
          <div className="fixed right-0 top-0 h-full w-full sm:w-120 bg-white shadow-2xl z-50 overflow-y-auto">

            <div className="bg-red-600 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1.5 ${CAMP_STATUS[getCampStatus(selectedCamp)].badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${CAMP_STATUS[getCampStatus(selectedCamp)].dot}`} />
                  {CAMP_STATUS[getCampStatus(selectedCamp)].label}
                </span>
                <button
                  onClick={() => setSelectedCamp(null)}
                  className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg transition"
                >
                  <X size={16} />
                </button>
              </div>
              <h2 className="text-white font-bold text-xl leading-tight">{selectedCamp.campTitle}</h2>
              {selectedCamp.campDescription && (
                <p className="text-white/70 text-sm mt-2 leading-relaxed">{selectedCamp.campDescription}</p>
              )}
            </div>

            <div className="p-5 space-y-3">
              {/* Seat status */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={15} className="text-red-600" />
                  <h3 className="text-sm font-bold text-gray-700">Registration Status</h3>
                </div>
                <div className="flex gap-6">
                  {[
                    { label: 'Total',      val: selectedCamp.expectedDonors,                                color: 'text-gray-800'  },
                    { label: 'Registered', val: selectedCamp.registeredCount,                               color: 'text-green-600' },
                    { label: 'Available',  val: selectedCamp.expectedDonors - selectedCamp.registeredCount, color: 'text-blue-600'  },
                  ].map(s => (
                    <div key={s.label}>
                      <p className="text-[11px] text-gray-400">{s.label}</p>
                      <p className={`text-base font-bold ${s.color}`}>{s.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail rows */}
              {[
                { icon: <Calendar size={16} />, label: 'Date',        val: selectedCamp.date?.split('T')[0] },
                { icon: <Clock    size={16} />, label: 'Time',        val: `${selectedCamp.startTime} – ${selectedCamp.endTime}` },
                { icon: <MapPin   size={16} />, label: 'Location',    val: `${selectedCamp.streetAddress}, ${selectedCamp.city} (${selectedCamp.district})` },
                { icon: <User     size={16} />, label: 'Coordinator', val: `${selectedCamp.coordinatorName} · ${selectedCamp.coordinatorContact}` },
              ].map(row => (
                <div key={row.label} className="border border-gray-100 rounded-xl p-3 flex gap-3 items-start">
                  <span className="text-red-500 mt-0.5 shrink-0">{row.icon}</span>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{row.label}</p>
                    <p className="text-sm text-gray-700 mt-0.5">{row.val}</p>
                  </div>
                </div>
              ))}

              {/* Hospital */}
              <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-3 flex gap-3 items-start">
                <Building size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hospital</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">{selectedCamp.hospitalName}</p>
                  <p className="text-xs text-gray-400">{selectedCamp.hospitalCity}, {selectedCamp.hospitalDistrict}</p>
                </div>
              </div>

              <button
                onClick={() => setShowRegisterForm(true)}
                className="w-full py-3 bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition text-sm"
              >
                <Heart size={16} /> Register for this Camp <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════ REGISTER FORM ════════════════════════════ */}
      {showRegisterForm && donorProfile && selectedCamp && (
        <RegisterCamp
          campId={selectedCamp._id}
          donorProfile={donorProfile}
          onClose={() => { setShowRegisterForm(false); setSelectedCamp(null); }}
        />
      )}

      {/* ══════════════════════════ DONATE MODAL ═════════════════════════════ */}
      {selectedNotif && donorProfile && (
        <DonateFormModal
          notification={selectedNotif}
          donorProfile={donorProfile}
          onClose={() => setSelectedNotif(null)}
          onSuccess={handleResponded}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ icon, iconBg, value, label }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-extrabold text-gray-800 leading-tight">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </div>
  );
}

function EmptyState({ icon, text, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center text-gray-400 gap-2">
      <span className="opacity-25">{icon}</span>
      <p className="font-semibold text-sm">{text}</p>
      {sub && <p className="text-xs opacity-70">{sub}</p>}
    </div>
  );
}
