import React, { useEffect, useState } from "react";
import { useGeoLocation } from "./useGeoLocation";
import { useAddressByLocation } from "../../hook/address/useNewAddress";
import { FaMapMarkerAlt } from "react-icons/fa"; // using FontAwesome icon
import './GeoLocationButton.css';

const GeoLocationPicker = ({ onAddressSelected, clear  }) => {
 
    const { coords, getLocation, error } = useGeoLocation();
    const [fetchTrigger, setFetchTrigger] = useState(false);
    const [canFill, setCanFill] = useState(true); // persists across renders

    const { data: geoAddress, refetch, isLoading } = useAddressByLocation(coords, {
        enabled: false,
    });

    // Reset canFill when clear becomes true
    useEffect(() => {
        if (clear) {
            setCanFill(true);
        }
    }, [clear]);

    // When coords are ready → fetch API once per click
    useEffect(() => {
        if (fetchTrigger && coords?.latitude && coords?.longitude) {
            console.log("Coords ready, refetching address...", coords);
            refetch();
            setFetchTrigger(false);
        }
    }, [coords, fetchTrigger, refetch]);

    // When API returns → send to parent only if allowed
    useEffect(() => {
        if (geoAddress && coords?.latitude && coords?.longitude && canFill) {
            console.log("Geo address received:", geoAddress);
            onAddressSelected({
                ...geoAddress,
                latitude: coords.latitude,
                longitude: coords.longitude,
            });
            setCanFill(false); // prevent continuous fill
        }
    }, [geoAddress, coords, onAddressSelected, canFill]);

    return (
        <div>
            <button
               onClick={() => {
                    console.log("Button clicked: getting location...");
                    getLocation();
                    setFetchTrigger(true);
                    if (clear) setCanFill(true); // allow next fill after clear
                }}
                className={`button-location`}
           
            >
                <span className="button-content">
                    <FaMapMarkerAlt className="icon" />
                     Use My Location
                </span>
            </button>

            {/* {isLoading && <p>Fetching address...</p>} */}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default GeoLocationPicker;
