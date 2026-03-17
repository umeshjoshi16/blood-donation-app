import React, { useState, useEffect } from 'react';
import { Phone, CheckCircle, XCircle, Search, Mail, RefreshCw, Droplets } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:8000';

// ─────────────────────────────────────────────────────────────────────────────
// DonorsListView
// Fetches from GET /active-donors ONLY when this component renders.
// Shows donors with donatedBlood > 0, with eligibility (>90 days since last donation).
// ─────────────────────────────────────────────────────────────────────────────

export default function DonorsListView() {
  const [donors,  setDonors]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('All');

  
  useEffect(() => {
    const fetchActiveDonors = async () => {
      try {
        setLoading(true);
        setError(null);

        // GET /active-donors — dedicated route, only called here
        const res = await axios.get(`${API}/active-donors`, { withCredentials: true });

        // Handle plain array or wrapped { donors: [...] }
        const data = Array.isArray(res.data) ? res.data : res.data.donors ?? [];

        setDonors(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load donors');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveDonors();
  }, []); 


  const filtered = donors.filter(d => {
    const q = search.toLowerCase();
    const matchSearch =
      d.userName?.toLowerCase().includes(q)   ||
      d.bloodGroup?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q)      ||
      d.phoneNumber?.includes(q);
    const matchFilter =
      filter === 'All' || d.eligibilityStatus === filter;
    return matchSearch && matchFilter;
  });


  const eligibleCount    = donors.filter(d => d.eligibilityStatus === 'Eligible').length;
  const notEligibleCount = donors.filter(d => d.eligibilityStatus === 'Not Eligible').length;


  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400">
      <RefreshCw size={22} className="animate-spin mr-2 text-red-400" />
      <span className="text-sm">Loading donors…</span>
    </div>
  );


  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-2">
      <XCircle size={28} />
      <p className="text-sm font-medium">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-700 transition"
      >
        Retry
      </button>
    </div>
  );

 
  return (
    <div className="space-y-4">

      {/* ── Summary pills ── */}
      <div className="flex flex-wrap gap-3">
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
          <Droplets size={16} className="text-red-500" />
          <span className="text-sm font-semibold text-gray-700">
            {donors.length} active donors
          </span>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-2 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          <span className="text-sm font-semibold text-green-700">
            {eligibleCount} eligible
          </span>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2 flex items-center gap-2">
          <XCircle size={16} className="text-red-400" />
          <span className="text-sm font-semibold text-red-600">
            {notEligibleCount} not eligible
          </span>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, blood type or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-400 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Eligible', 'Not Eligible'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition border ${
                filter === f
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-500 text-sm">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Blood Type</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Total Donations</th>
                <th className="px-4 py-3 font-medium">Last Donated</th>
                <th className="px-4 py-3 font-medium">Days Since</th>
                <th className="px-4 py-3 font-medium">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400 text-sm">
                    No donors found.
                  </td>
                </tr>
              ) : (
                filtered.map(donor => (
                  <tr key={donor._id} className="hover:bg-gray-50 transition text-sm">

                    {/* donorSchema → userName */}
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {donor.userName}
                    </td>

                    {/* donorSchema → bloodGroup */}
                    <td className="px-4 py-3">
                      <span className="inline-block bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded text-xs">
                        {donor.bloodGroup}
                      </span>
                    </td>

                    {/* donorSchema → phoneNumber */}
                    <td className="px-4 py-3 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Phone size={12} className="text-gray-400" />
                        {donor.phoneNumber}
                      </span>
                    </td>

                    {/* donorSchema → email */}
                    <td className="px-4 py-3 text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-gray-400" />
                        {donor.email}
                      </span>
                    </td>

                    {/* donorSchema → donatedBlood */}
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded text-xs">
                        {donor.donatedBlood}
                      </span>
                    </td>

                    {/* donorSchema → lastDonated */}
                    <td className="px-4 py-3 text-gray-500">
                      {donor.lastDonated
                        ? new Date(donor.lastDonated).toLocaleDateString()
                        : '—'}
                    </td>

                    {/* computed by controller → daysSinceLastDonation */}
                    <td className="px-4 py-3">
                      {donor.daysSinceLastDonation !== null && donor.daysSinceLastDonation !== undefined ? (
                        <span className={`font-semibold text-sm ${
                          donor.daysSinceLastDonation > 90 ? 'text-green-600' : 'text-orange-500'
                        }`}>
                          {donor.daysSinceLastDonation}d
                        </span>
                      ) : '—'}
                    </td>

                    {/* computed by controller → eligibilityStatus (> 90 days = Eligible) */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        donor.eligibilityStatus === 'Eligible'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100   text-red-500'
                      }`}>
                        {donor.eligibilityStatus === 'Eligible'
                          ? <CheckCircle size={11} />
                          : <XCircle    size={11} />}
                        {donor.eligibilityStatus}
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>Showing {filtered.length} of {donors.length} donors (≥1 donation)</span>
          <span>Eligible = last donated more than 90 days ago</span>
        </div>
      </div>

    </div>
  );
}