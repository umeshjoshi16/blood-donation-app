import React, { useEffect } from "react";
import axios from "axios";

export default function GetLocation() {
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }

   
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude:", latitude, "Longitude:", longitude);

   
      //   try {
      //     const res = await axios.put(
      //       "http://localhost:8000/location", 
      //       { latitude, longitude },
      //       { withCredentials: true } 
      //     );
      //     console.log("Location saved to backend:", res.data);
      //   } catch (err) {
      //     console.error("Error sending location to backend:", err);
      //   }
      // },
      // (error) => {
      //   if (error.code === 1) console.error("Permission denied");
      //   else if (error.code === 2) console.error("Position unavailable");
      //   else if (error.code === 3) console.error("Request timed out");
      //   else console.error("Error getting location");
      // 
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []); // Empty dependency array → runs only once

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-700 text-lg">Requesting your location...</p>
    </div>
  );
}
