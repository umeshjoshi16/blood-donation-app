import { useState } from "react";
import { X, Droplets, User, Phone, MapPin, Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function DonateFormModal({ notification, donorProfile, onClose, onSuccess }) {
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async () => {
  //   if (!confirmed) {
  //     toast.error("Please confirm your willingness to donate");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     await axios.post(
  //       "http://localhost:8000/donation-response",
  //       {
  //         emergencyRequestId: notification.id,
  //         message,
  //       },
  //       { withCredentials: true }
  //     );

  //     toast.success("Response sent to hospital!");
  //     onSuccess(notification.id); // mark as responded in parent
  //     onClose();
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to submit");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
  if (!confirmed) {
    toast.error("Please confirm your willingness to donate");
    return;
  }

  setLoading(true);
  try {
    await axios.post(
      "http://localhost:8000/emergency-donation-response",
      {
        emergencyRequestId: notification.id,
        message,
        donorId: donorProfile._id,
        donorName: donorProfile.userName,
        donorEmail: donorProfile.email,
        bloodGroup: donorProfile.bloodGroup,
        unitsDonated: 1
      },
      { withCredentials: true }
    );

    toast.success("Response sent to hospital!");
    onSuccess(notification.id); // mark as responded in parent
    onClose();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to submit");
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-201 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

          {/* Header */}
          <div className="bg-red-600 p-5 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Droplets size={20} className="text-white" />
                <span className="text-white font-bold text-lg">Donation Request</span>
              </div>
              <p className="text-red-100 text-sm">{notification.hospitalName} · {notification.hospitalCity}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Emergency info strip */}
          <div className="bg-red-50 border-b border-red-100 px-5 py-3 flex items-center gap-3">
            <span className="text-2xl font-black text-red-600">{notification.bloodType}</span>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Blood Needed</p>
              <p className="text-sm text-gray-700">{notification.units} unit{notification.units > 1 ? "s" : ""} · Patient: {notification.patientName}</p>
            </div>
          </div>

          <div className="p-5 space-y-4">

            {/* Auto-filled donor info */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Info (Auto-filled)</p>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-3">
                  <User size={15} className="text-red-400 shrink-0" />
                  <span className="text-sm text-gray-700">{donorProfile.userName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Droplets size={15} className="text-red-400 shrink-0" />
                  <span className="text-sm text-gray-700">Blood Group: <span className="font-bold text-red-600">{donorProfile.bloodGroup}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-red-400 shrink-0" />
                  <span className="text-sm text-gray-700">{donorProfile.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={15} className="text-red-400 shrink-0" />
                  <span className="text-sm text-gray-700">{donorProfile.city}, {donorProfile.district}</span>
                </div>
              </div>
            </div>

            {/* Message to hospital */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Message to Hospital <span className="text-gray-300 normal-case">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. I'm available today after 2pm..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
              />
            </div>

            {/* Confirmation checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition
                  ${confirmed ? "bg-red-600 border-red-600" : "border-gray-300 group-hover:border-red-400"}`}
                >
                  {confirmed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-700 leading-snug">
                I confirm that I am willing to donate blood and my information is correct
              </span>
            </label>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!confirmed || loading}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition
                ${confirmed && !loading
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <Heart size={16} />
              {loading ? "Submitting..." : "Send Donation Request to Hospital"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}