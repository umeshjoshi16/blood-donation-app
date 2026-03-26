import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";

export default function Certificate({ donor, camp }) {
  const certRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(false);

  const certificateData = {
    name: donor.userName,
    date: camp?.date ? new Date(camp.date).toLocaleDateString() : "",
    location: `${camp?.streetAddress}, ${camp?.city}`,
    hospitalName: camp?.hospitalName,
    coordinatorName: camp?.coordinatorName,
    medicalOfficer: "DR.Kailash Singh",
  };

  const handleCapture = async () => {
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      canvas.toBlob((blob) => {
        const previewUrl = URL.createObjectURL(blob);
        setPreview({ blob, url: previewUrl, filename: `certificate_${donor._id}.png` });
      }, "image/png");

    } catch (err) {
      console.error("Capture failed:", err);
      toast.error("Failed to capture: " + err.message);
    }
  };

  const handleSave = async () => {
    if (!preview) return;
    try {
      const formData = new FormData();
      formData.append("certificate", preview.blob, preview.filename);
      formData.append("donorId", donor._id);

      await axios.post("http://localhost:8000/donor/upload-certificate", formData, {
        withCredentials: true,
      });

      setSaved(true);
      toast.success("Certificate saved to your profile!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save certificate");
    }
  };

  const handleDownload = () => {
    if (!preview) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const a = document.createElement("a");
      a.href = reader.result;
      a.download = preview.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    reader.readAsDataURL(preview.blob);
  };

  return (
    
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#f3f4f6" }}>
   <Toaster />
     
      {!preview && (
        <button
          onClick={handleCapture}
          className="mb-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-bold cursor-pointer"
        >
          Generate Certificate
        </button>
      )}

      {/* Step 2 — Filename + Preview + Buttons */}
      {preview && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "16px", width: "100%" }}>
          <div style={{ fontSize: "14px", color: "#4b5563", fontWeight: "500", backgroundColor: "#e5e7eb", padding: "8px 16px", borderRadius: "8px" }}>
            📄 {preview.filename}
          </div>
          <img
            src={preview.url}
            alt="Certificate Preview"
            style={{ width: "100%", maxWidth: "700px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", border: "1px solid #d1d5db" }}
          />
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 font-bold cursor-pointer"
            >
              ⬇ Download to Device
            </button>
            <button
              onClick={handleSave}
              disabled={saved}
              className={`px-6 py-2 rounded-xl font-bold cursor-pointer text-white ${saved ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
            >
              {saved ? "✅ Saved to Profile" : "Save to Profile"}
            </button>
            <button
              onClick={() => { setPreview(null); setSaved(false); }}
              className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 font-bold cursor-pointer"
            >
              ✕ Retake
            </button>
          </div>
        </div>
      )}

    
      <div
        ref={certRef}
        style={{ backgroundColor: "#f3f4f6", padding: "32px", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}
      >
        <div style={{ position: "relative", width: "900px", backgroundColor: "#ffffff", boxShadow: "0 25px 50px rgba(0,0,0,0.25)", overflow: "hidden", border: "8px solid #ffffff" }}>

          
          <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "320px", height: "320px", backgroundColor: "#b91c1c", transform: "rotate(45deg)", zIndex: 10, borderRight: "8px solid #ffffff" }}></div>

          
          <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "192px", height: "192px", backgroundColor: "#facc15", borderRadius: "24px", transform: "rotate(12deg)", zIndex: 10, border: "8px solid #ffffff" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", transform: "rotate(-12deg)" }}>
              <div style={{ backgroundColor: "#b91c1c", padding: "16px", borderRadius: "12px" }}>
                <svg style={{ width: "48px", height: "48px" }} fill="white" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>
          </div>

         
          <div style={{ position: "absolute", top: "24px", right: "24px", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#b91c1c", color: "#ffffff", padding: "8px", borderRadius: "0 0 8px 8px", zIndex: 20 }}>
            <span style={{ fontSize: "8px", fontWeight: "bold", textAlign: "center", lineHeight: 1.2 }}>BLOOD CARE</span>
          </div>

          
          <div style={{ position: "absolute", top: "25%", left: "-48px", width: "128px", height: "128px", border: "10px solid #b91c1c", borderRadius: "50%", opacity: 0.2 }}></div>

          
          <div style={{ position: "relative", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "28px", paddingLeft: "80px", paddingRight: "80px", textAlign: "center" }}>

            <h1 style={{ fontSize: "36px", fontWeight: "900", color: "#000000", letterSpacing: "-0.05em", textTransform: "uppercase", marginBottom: "4px" }}>
              Blood Care
            </h1>
            <p style={{ fontSize: "12px", fontWeight: "bold", color: "#374151", marginBottom: "4px" }}>
              Koteshwor, Kathmandu
            </p>
            <p style={{ fontSize: "14px", fontWeight: "bold", color: "#1f2937", margin: "0" }}>
              Mobile: <span style={{ color: "#000000" }}>984800000, 9777776876</span>
            </p>
            <p style={{ fontSize: "14px", fontWeight: "bold", color: "#1f2937", marginBottom: "32px" }}>
              Email: <span style={{ color: "#000000" }}>bloodcare@gmail.com</span>
            </p>

            <h2 style={{ fontSize: "56px", fontWeight: "normal", color: "#000000", marginBottom: "32px", fontFamily: "'UnifrakturMaguntia', serif" }}>
              Certificate of Excellence
            </h2>

            <div style={{ width: "100%", fontSize: "18px", color: "#1f2937", fontStyle: "italic" }}>
              <p style={{ margin: "0 0 16px 0" }}>This is to certify that</p>

              <div style={{ borderBottom: "2px dotted #9ca3af", width: "75%", margin: "0 auto 4px", paddingBottom: "4px" }}>
                <span style={{ fontSize: "24px", fontWeight: "bold", fontStyle: "normal", fontFamily: "serif", color: "#111827", textTransform: "uppercase" }}>
                  {certificateData.name}
                </span>
              </div>

              <p style={{ margin: "16px 0" }}>for the noble gesture of rendering humanitarian service by donating</p>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                <span>a unit of blood on</span>
                <span style={{ borderBottom: "2px dotted #9ca3af", fontWeight: "bold", fontStyle: "normal", padding: "0 8px" }}>
                  {certificateData.date}
                </span>
                <span>at</span>
                <span style={{ borderBottom: "2px dotted #9ca3af", fontWeight: "bold", fontStyle: "normal", padding: "0 8px" }}>
                  {certificateData.location}
                </span>
                <span>organized by</span>
                <span style={{ borderBottom: "2px dotted #9ca3af", fontWeight: "bold", fontStyle: "normal", padding: "0 8px" }}>
                  {certificateData.hospitalName}
                </span>
              </div>
            </div>

            <div style={{ width: "100%", marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <p style={{ fontSize: "30px", color: "#374151", marginBottom: "36px", fontFamily: "'Dancing Script', cursive" }}>
                Blood Care Deeply Appreciates
              </p>

              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "0 40px 32px", alignItems: "flex-end" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ borderBottom: "2px dotted #9ca3af", paddingBottom: "4px", marginTop: "16px", minWidth: "150px", textAlign: "center" }}>
                    <span style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "serif", color: "#111827", textTransform: "uppercase" }}>
                      {certificateData.coordinatorName}
                    </span>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: "bold", color: "#000000", margin: "4px 0 0 0" }}>Camp Coordinator</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ borderBottom: "2px dotted #9ca3af", paddingBottom: "4px", marginTop: "16px", minWidth: "150px", textAlign: "center" }}>
                    <span style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "serif", color: "#111827", textTransform: "uppercase" }}>
                      {certificateData.medicalOfficer}
                    </span>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: "bold", color: "#000000", margin: "4px 0 0 0" }}>Authorized Person</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}