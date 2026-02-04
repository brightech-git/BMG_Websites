import { useState } from "react";

export const useGeoLocation = () => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      console.error("Geolocation is not supported by this browser");
      return;
    }

    console.log("Requesting user location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Geolocation success:", position);
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError(err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return { coords, error, getLocation };
};
