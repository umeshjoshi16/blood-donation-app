

import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle, Calendar, Droplets, LayoutDashboard,
  Menu, Users, X, Activity, Building2, Mail, Phone, MapPin, User,
  RefreshCw, ChevronRight, Clock,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import axios from 'axios';

import RequestBloodForm from './EmergencyRequestFrom';
import OrganizeCampForm from './BloodCampForm';
import DonorsListView   from './DonorsList';



const API = 'http://localhost:8000';
const ML_API = 'http://localhost:5001';

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard',         to: '/dashboard-hospital' },
  { icon: <AlertCircle size={20} />,     label: 'Emergency Request', to: '/dashboard-hospital/emergency-request' },
  { icon: <Calendar size={20} />,        label: 'Blood Camps',       to: '/dashboard-hospital/blood-camp' },
  { icon: <Users size={20} />,           label: 'Donors List',       to: '/dashboard-hospital/donor-list' },
];

const PAGE_TITLES = {
  '/dashboard-hospital':                   'Dashboard',
  '/dashboard-hospital/emergency-request': 'Emergency Request',
  '/dashboard-hospital/blood-camp':        'Blood Camps',
  '/dashboard-hospital/donor-list':        'Donors List',
};


function useDashboardData() {
  const [data, setData] = useState({
    camps:             [],
    campRegistrations: [],
    donationResponses: [],
    donors:            [],
    emergencyRequests: [],
    hospitals:         [],
    organizations:     [],
  });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        campsRes,
        campRegsRes,
        donationResRes,
        donorsRes,
        emergencyRes,
        hospitalsRes,
        orgsRes,
      ] = await Promise.all([
        axios.get(`${API}/camps`,              { withCredentials: true }),
        axios.get(`${API}/campregistrations`,  { withCredentials: true }),
        axios.get(`${API}/donationresponses`,  { withCredentials: true }),
        axios.get(`${API}/donors`,             { withCredentials: true }),
        axios.get(`${API}/emergency-requests`, { withCredentials: true }), // your existing route
        axios.get(`${API}/hospitals`,          { withCredentials: true }),
        axios.get(`${API}/organizations`,      { withCredentials: true }),
      ]);

      // Each controller may return a plain array OR a wrapped object like { requests: [...] }
      // These helpers extract the array safely either way
      const toArray = (d, ...keys) => {
        if (Array.isArray(d)) return d;
        for (const k of keys) if (Array.isArray(d?.[k])) return d[k];
        return [];
      };

      setData({
        camps:             toArray(campsRes.data,        'camps'),
        campRegistrations: toArray(campRegsRes.data,     'campRegistrations', 'registrations'),
        donationResponses: toArray(donationResRes.data,  'donationResponses', 'responses'),
        donors:            toArray(donorsRes.data,       'donors'),
        emergencyRequests: toArray(emergencyRes.data,    'requests', 'emergencyRequests', 'data'),
        hospitals:         toArray(hospitalsRes.data,    'hospitals'),
        organizations:     toArray(orgsRes.data,         'organizations'),
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load dashboard data';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return { ...data, loading, error, refetch: fetchAll };
}



export default function DashboardHospital() {
  const [isSidebarOpen,   setIsSidebarOpen]   = useState(false);
  const [hospital,        setHospital]        = useState(null);
  const [showModal,       setShowModal]       = useState(false);
  const [selectedPending, setSelectedPending] = useState(null);
  const { pathname } = useLocation();
  const navigate     = useNavigate();

  const {
    camps,
    campRegistrations,
    donationResponses,
    donors,
    emergencyRequests,
    hospitals,
    organizations,
    loading,
    error,
    refetch,
  } = useDashboardData();

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // Fetch logged-in hospital profile — your existing GET /profile route
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/profile`, { withCredentials: true });
        setHospital(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogOut = async () => {
    await axios.post(`${API}/logout`, {}, { withCredentials: true });
    localStorage.clear();
    sessionStorage.clear();
    navigate('/', { replace: true });
  };

  
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <RefreshCw size={28} className="animate-spin text-red-500" />
        <p className="text-sm font-medium">Loading dashboard…</p>
      </div>
    </div>
  );

 
  if (error) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3 text-center">
        <AlertCircle size={32} className="text-red-500" />
        <p className="text-sm text-red-600 font-medium">{error}</p>
        <button
          onClick={refetch}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Toaster position="top-right" />

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={toggleSidebar} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col
        transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Droplets className="text-red-600" size={28} />
            <span className="text-lg font-bold text-gray-800">Blood Care</span>
          </div>
          <button className="md:hidden" onClick={toggleSidebar}>
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {NAV_ITEMS.map(({ icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard-hospital'}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-red-50 text-red-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        
        <button
          onClick={() => setShowModal(true)}
          className="p-4 border-t border-gray-200 w-full cursor-pointer hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <Activity size={16} className="text-red-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">
                {hospital?.hospitalName || '…'}
              </p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
        </button>
      </aside>

      {/* ── Hospital Profile Modal ── */}
      {showModal && hospital && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-[90%] max-w-md p-5 shadow-xl">

            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 size={22} className="text-blue-600" />
                </div>
                <div>
                  {/* hospitalSchema → hospitalName, registrationNumber */}
                  <h2 className="font-bold text-lg">{hospital.hospitalName}</h2>
                  <span className="text-xs text-blue-500 font-semibold">
                    Reg: {hospital.registrationNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
              >✕</button>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              {/* hospitalSchema → email */}
              <div className="flex items-start gap-2">
                <Mail size={16} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Email</p>
                  <p className="text-gray-700 font-medium">{hospital.email}</p>
                </div>
              </div>
              {/* hospitalSchema → phoneNumber */}
              <div className="flex items-start gap-2">
                <Phone size={16} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Phone</p>
                  <p className="text-gray-700 font-medium">{hospital.phoneNumber}</p>
                </div>
              </div>
              {/* hospitalSchema → streetAddress, city, district, province */}
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Address</p>
                  <p className="text-gray-700 font-medium">
                    {hospital.streetAddress}, {hospital.city}, {hospital.district}, {hospital.province}
                  </p>
                </div>
              </div>
              {/* hospitalSchema → contactPersonName, contactPersonNumber */}
              <div className="flex items-start gap-2">
                <User size={16} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Contact Person</p>
                  <p className="text-gray-700 font-medium">{hospital.contactPersonName}</p>
                  <p className="text-gray-500">{hospital.contactPersonNumber}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl font-bold text-sm cursor-pointer"
              >Close</button>
              <button
                onClick={handleLogOut}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-bold text-sm cursor-pointer"
              >Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto w-full">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 md:px-8">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <button onClick={toggleSidebar} className="p-2 -ml-2 md:hidden">
                <Menu size={24} className="text-gray-600" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                {PAGE_TITLES[pathname] ?? 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refetch}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                title="Refresh data"
              >
                <RefreshCw size={16} className="text-gray-500" />
              </button>
             
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route
              index
              element={
                <DashboardHome
                  camps={camps}
                  hospital={hospital} 
                  campRegistrations={campRegistrations}
                  donationResponses={donationResponses}
                  donors={donors}
                  emergencyRequests={emergencyRequests}
                  hospitals={hospitals}
                  organizations={organizations}
                  selectedPending={selectedPending}
                  setSelectedPending={setSelectedPending}
                  refetch={refetch}
                />
              }
            />
            <Route path="emergency-request" element={<RequestBloodForm refetch={refetch} />} />
            <Route path="blood-camp"        element={<OrganizeCampForm refetch={refetch} />} />
            <Route path="donor-list"        element={<DonorsListView donors={donors} />} />
            <Route path="*" element={<Navigate to="/dashboard-hospital" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}


function DashboardHome({
  camps,
  campRegistrations,
  donationResponses,
   hospital, 
  donors,
  emergencyRequests,
  hospitals,
  organizations,
  selectedPending,
  setSelectedPending,
}) {
  const now = new Date();

  // campSchema → date, status enum: "Upcoming" | "Ongoing" | "Completed" | "Cancelled"
  const campsThisMonth = camps.filter(c => {
    const d = new Date(c.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // emergencySchema → status enum: "Pending" | "Fulfilled" | "Cancelled"
const pendingRequests = emergencyRequests.filter(
    r => r.status === 'Pending' && r.hospitalId?.toString() === hospital?._id?.toString()
  );
   const myRequestIds = new Set(
    emergencyRequests
      .filter(r => r.hospitalId?.toString() === hospital?._id?.toString())
      .map(r => r._id?.toString())
  );
  const myDonationResponses = donationResponses.filter(
    dr => myRequestIds.has(dr.emergencyRequestId?.toString())
  );

  

  return (
    <div className="space-y-6">

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total Donors"     value={donors.length}          color="blue"   icon={<Users size={20} />} />
        <SummaryCard label="Camps This Month" value={campsThisMonth}         color="green"  icon={<Calendar size={20} />} />
        <SummaryCard label="Pending Requests" value={pendingRequests.length} color="orange" icon={<AlertCircle size={20} />} />
        
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Camp Registrations</p>
          {/* campRegistrationSchema → total count */}
          <p className="text-3xl font-extrabold text-gray-800">{campRegistrations.length}</p>
          <p className="text-xs text-gray-400 mt-1">total sign-ups across all camps</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Donation Responses</p>
          {/* donationResponseSchema → total count */}
          <p className="text-3xl font-extrabold text-gray-800">{donationResponses.length}</p>
          <p className="text-xs text-gray-400 mt-1">donors who responded to requests</p>
        </div>
        
      </div>

      {/* ── Pending Emergency Requests ── */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-base font-semibold mb-4 text-gray-800">Pending Emergency Requests</h3>

        {!selectedPending ? (
          <>
            {pendingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <AlertCircle size={32} className="mb-2 opacity-40" />
                <p className="text-sm">No pending emergency requests</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {pendingRequests.map(req => {
                  // donationResponseSchema → emergencyRequestId links responses to this request
                  const responseCount = donationResponses.filter(
                    dr => dr.emergencyRequestId?.toString() === req._id?.toString()
                  ).length;
                  

                  return (
                    <div
                      key={req._id}
                      onClick={() => setSelectedPending(req)}
                      className="bg-red-900 text-white rounded-xl flex flex-col gap-3 p-4 w-72 cursor-pointer hover:bg-red-800 transition"
                    >
                      <div className="flex flex-row items-center gap-3">
                        <div className="flex items-center justify-center bg-red-400/30 rounded-full h-11 w-11 shrink-0">
                          {/* emergencySchema → bloodType */}
                          <h1 className="font-extrabold text-sm">{req.bloodType}</h1>
                        </div>
                        <div>
                          {/* emergencySchema → patientName */}
                          <h1 className="font-bold text-base">{req.patientName}</h1>
                          <p className="text-red-300 text-xs flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-red-700" />

                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-red-300 text-xs">Units Required</p>
                          {/* emergencySchema → units */}
                          <p className="font-bold">{req.units} units</p>
                        </div>
                        <div className="text-right">
                          <p className="text-red-300 text-xs">Hospital</p>
                          {/* emergencySchema → hospitalName */}
                          <p className="font-bold text-xs">{req.hospitalName}</p>
                        </div>
                      </div>

                      <div className="bg-red-800/50 rounded-lg px-3 py-2">
                        <p className="text-red-300 text-xs mb-0.5">Reason</p>
                        {/* emergencySchema → reason */}
                        <p className="text-sm line-clamp-2">{req.reason}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-300 text-xs">Responses</p>
                          <p className="font-bold"> {req.respondedBy?.length || 0} donor{req.respondedBy?.length === 1 ? '' : 's'}</p>
                        </div>
                        <ChevronRight size={16} className="text-red-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <DetailView
            request={selectedPending}
            donationResponses={donationResponses}
            donors={donors}
            onBack={() => setSelectedPending(null)}
             hospital={hospital}  
          />
        )}
      </div>

      {/* ── Upcoming Blood Camps ── */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-base font-semibold mb-4 text-gray-800">Upcoming Blood Camps</h3>
        {camps.length === 0 ? (
          <p className="text-sm text-gray-400">No camps scheduled.</p>
        ) : (
          <div className="space-y-2">
            {camps
              .filter(c => c.status === 'Upcoming' || c.status === 'Ongoing')
              .slice(0, 5)
              .map(c => (
                <div key={c._id} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
                  <div>
                    {/* campSchema → campTitle, city, district, date, startTime, endTime, coordinatorName */}
                    <p className="font-semibold text-sm text-gray-800">{c.campTitle}</p>
                    <p className="text-xs text-gray-400">
                      {c.city}, {c.district} · {new Date(c.date).toLocaleDateString()} · {c.startTime}–{c.endTime}
                    </p>
                    <p className="text-xs text-gray-400">Coordinator: {c.coordinatorName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {/* campSchema → status */}
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      c.status === 'Upcoming' ? 'bg-green-100 text-green-700' :
                      c.status === 'Ongoing'  ? 'bg-blue-100  text-blue-700'  :
                                                'bg-gray-100  text-gray-600'
                    }`}>
                      {c.status}
                    </span>
                    {/* campSchema → registeredCount, expectedDonors */}
                    <p className="text-xs text-gray-400">{c.registeredCount}/{c.expectedDonors} donors</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ── Recent Camp Registrations ── */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-base font-semibold mb-4 text-gray-800">Recent Camp Registrations</h3>
        {campRegistrations.length === 0 ? (
          <p className="text-sm text-gray-400">No registrations yet.</p>
        ) : (
          <div className="space-y-2">
            {campRegistrations.slice(0, 5).map(cr => (
              <div key={cr._id} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                    {/* campRegistrationSchema → name */}
                    {(cr.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    {/* campRegistrationSchema → name, bloodGroup, city */}
                    <p className="font-semibold text-sm text-gray-800">{cr.name}</p>
                    <p className="text-xs text-gray-400">
                      {cr.bloodGroup} · {cr.city}
                      {/* campId populated → campTitle */}
                      {cr.campId?.campTitle ? ` · ${cr.campId.campTitle}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {/* campRegistrationSchema → registrationStatus enum: "Registered"|"Cancelled"|"Completed" */}
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    cr.registrationStatus === 'Registered' ? 'bg-green-100 text-green-700'  :
                    cr.registrationStatus === 'Completed'  ? 'bg-blue-100  text-blue-700'   :
                                                             'bg-red-100   text-red-600'
                  }`}>
                    {cr.registrationStatus}
                  </span>
                  <p className="text-xs text-gray-400">
                    {new Date(cr.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}





function DetailView({ request, donationResponses, donors, onBack,hospital }) {
  const [scoredDonors, setScoredDonors] = useState([]);
  const [mlLoading, setMlLoading] = useState(true);
  const [mlError, setMlError] = useState(null);

  // Filter responses and donors for this specific request
  const responsesForRequest = donationResponses.filter(
    dr => dr.emergencyRequestId?.toString() === request._id?.toString()
  );

  const respondedDonorIds = new Set(
    responsesForRequest
      .map(dr => (dr.donorId?._id || dr.donorId)?.toString())
      .filter(Boolean)
  );
console.log("donors:", donors);
console.log("responsesForRequest:", responsesForRequest);
console.log("respondedDonorIds:", [...respondedDonorIds]);
  const respondedDonors = donors.filter(d => respondedDonorIds.has(d._id?.toString()));

  // ── NEW: call ML server when this view opens ──
useEffect(() => {
  console.log("🔥 useEffect triggered");

  if (!request?.respondedBy || request.respondedBy.length === 0) {
    console.log("❌ No responded donors");
    setMlLoading(false);
    setScoredDonors([]);
    return;
  }

  const scoreWithML = async () => {
    try {
      setMlLoading(true);
      setMlError(null);

      const emails = request.respondedBy
        .map(d => d.donorEmail)
        .filter(Boolean);

      console.log("📤 Emails being sent:", emails);

      if (!emails.length) {
        console.log("❌ No valid emails");
        setMlLoading(false);
        return;
      }

      console.log("🚀 Calling ML API...");

      const { data } = await axios.post(
        'http://127.0.0.1:5001/predict-batch',
        {
          hospital_city: request.hospitalCity || '',
          blood_group_needed: request.bloodType || '',
          emails: emails
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log("✅ ML Response:", data);

      const scoreByEmail = {};
      data.ranked_donors.forEach(r => {
        scoreByEmail[r.email] = r;
      });

      // Merge with respondedBy
      const merged = request.respondedBy.map(d => ({
        ...d,
        mlScore: scoreByEmail[d.donorEmail] || null
      }));

      setScoredDonors(merged);

    } catch (err) {
      console.error("❌ ML Error:", err);
      setMlError("ML failed");
    } finally {
      setMlLoading(false);
    }
  };

  scoreWithML();

}, [request.respondedBy]);


  const getPct = (d) => Math.round((d.mlScore?.probability ?? 0) * 100);

  const getBadgeClass = (pct) => {
    if (pct >= 75) return 'bg-green-100 text-green-700';
    if (pct >= 45) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-600';
  };

  // ── Merge ML score and phone number with respondedBy ──
  const respondedWithScores = request.respondedBy?.map(dr => {
    const scored = scoredDonors.find(sd => sd.email === dr.donorEmail) || {};
    return {
      ...dr,
      mlScore: scored.mlScore || null,
      priority: scored.mlScore?.priority,
      phoneNumber: scored.phoneNumber || '',
    };
  }) || [];
  const topDonors = [...scoredDonors].sort(
  (a, b) => (b.mlScore?.probability ?? 0) - (a.mlScore?.probability ?? 0)
);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">

      <button
        onClick={onBack}
        className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
      >
        ← Back
      </button>

      {/* ── Request Details ── */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-red-100 rounded-full h-12 w-12 shrink-0">
            <p className="font-extrabold text-red-700">{request.bloodType}</p>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{request.patientName}</h2>
            <p className="text-xs text-gray-400">
              Posted at {new Date(request.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-lg p-3 border border-red-100">
            <p className="text-xs text-gray-400">Units Required</p>
            <p className="font-bold text-gray-800">{request.units} units</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-red-100">
            <p className="text-xs text-gray-400">Hospital</p>
            <p className="font-bold text-gray-800">{request.hospitalName}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-red-100">
            <p className="text-xs text-gray-400">City</p>
            <p className="font-bold text-gray-800">{request.hospitalCity}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-red-100">
            <p className="text-xs text-gray-400">District</p>
            <p className="font-bold text-gray-800">{request.hospitalDistrict}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-red-100 text-sm">
          <p className="text-xs text-gray-400 mb-1">Reason</p>
          <p className="text-gray-700">{request.reason}</p>
        </div>

        <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full ${
          request.status === 'Pending'   ? 'bg-yellow-100 text-yellow-700' :
          request.status === 'Fulfilled' ? 'bg-green-100  text-green-700'  :
                                           'bg-red-100    text-red-600'
        }`}>
          {request.status}
        </span>

        <button
          onClick={async () => {
            try {
              await axios.put(
                `http://localhost:8000/emergency-requests/${request._id}/fulfill`,
                {},
                { withCredentials: true }
              );
              toast.success("Marked as Fulfilled ✅");
              onBack();
            } catch (err) {
              toast.error("Failed to update");
            }
          }}
          className={`bg-green-600 cursor-pointer hover:bg-green-700 text-white px-4 py-1 rounded-lg text-xs font-bold ${
            request.status !== 'Pending' ? 'hidden' : ''
          }`}
        >
          Got Blood
        </button>
      </div>

      <div className='font-bold'>
        Ranking donors by AI probability…
      </div>

      {mlLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <RefreshCw size={14} className="animate-spin" />
          <span>Loading ML scores...</span>
        </div>
      )}
      {mlError && (
        <p className="text-xs text-yellow-600 bg-yellow-50 rounded-lg px-3 py-2">
          {mlError}
        </p>
      )}

      {!mlLoading && scoredDonors.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">
            Top Likely Donors
            <span className="ml-2 text-xs text-gray-400 font-normal">ranked by AI probability</span>
          </h3>
          
          <div className="space-y-2">
            {topDonors.slice(0, 3).map((d, i) => (
              <div
                key={d._id}
                className="flex items-center justify-between bg-green-50 border border-green-100 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-green-700">#{i + 1}</span>
                  <div>
                    <p className='font-medium'>{d.donorName || d.username || d.email}</p>
                    <p className="text-xs text-gray-400">
  {d.bloodGroup} · {d.donorEmail || d.email}
</p>
<button
  className="border rounded-xl border-green-500 bg-green-200 font-medium text-sm p-1 hover:bg-green-700 hover:cursor-pointer hover:text-white"
  onClick={async () => {
    try {
      await axios.post(
        `http://localhost:8000/sendEmail-emergency/${request._id}/fulfill`,
        {
          email: d.donorEmail || d.email,
          hospitalName: hospital?.hospitalName || 'Unknown Hospital',
          hospitalCity: hospital?.city || 'Unknown City',
          hospitalContact: hospital?.contactPersonNumber || 'N/A',
        },
        { withCredentials: true }
      );
      toast.success("Email sent successfully ✅");
    } catch (err) {
      console.error("Send Email Error:", err);
      toast.error("Failed to send email");
    }
  }}
>
  Send Email
</button>       </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${getBadgeClass(getPct(d))}`}>
                    {getPct(d)}% likely
                  </span>
                  {d.mlScore?.priority && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getBadgeClass(getPct(d))}`}>
                      {d.mlScore.priority}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── All Donors Who Responded ── */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">
          All Donors Who Responded
          <span className="ml-2 text-xs text-gray-400 font-normal">
            {request.respondedBy?.length || 0} donor{request.respondedBy?.length === 1 ? '' : 's'}
          </span>
        </h3>

        {(!request.respondedBy || request.respondedBy.length === 0) ? (
          <p className="text-sm text-gray-400">No donors have responded yet.</p>
        ) : (
          <div className="space-y-2">
            {respondedWithScores.map(dr => (
              <div key={dr._id} className="border border-gray-100 rounded-lg px-4 py-3 space-y-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-600">
                    {(dr.donorName || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{dr.donorName}</p>
                    <p className="text-xs text-gray-800">
                      {dr.bloodGroup} · {dr.donorEmail} · {dr.phoneNumber}
                    </p>
                    {dr.message && (
                      <p className="text-xs text-gray-500 italic">"{dr.message}"</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-2 text-xs">
                  {dr.unitsDonated && (
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {dr.unitsDonated} unit{dr.unitsDonated > 1 ? 's' : ''}
                    </span>
                  )}
                  {dr.mlScore && (
                    <span className={`px-2 py-1 rounded-full ${getBadgeClass(Math.round(dr.mlScore.probability * 100))}`}>
                      {Math.round(dr.mlScore.probability * 100)}% likely
                    </span>
                  )}
                  {dr.priority && (
                    <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-bold">
                      Priority: {dr.priority}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}



function SummaryCard({ label, value, color, icon }) {
  const colors = {
    blue:   'bg-blue-50   text-blue-600   border-blue-100',
    green:  'bg-green-50  text-green-600  border-green-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    red:    'bg-red-50    text-red-600    border-red-100',
  };
  return (
    <div className={`rounded-xl border p-4 flex items-center gap-3 ${colors[color]}`}>
      <div className="opacity-80">{icon}</div>
      <div>
        <p className="text-2xl font-extrabold leading-none">{value}</p>
        <p className="text-xs mt-1 opacity-70 font-medium">{label}</p>
      </div>
    </div>
  );
}