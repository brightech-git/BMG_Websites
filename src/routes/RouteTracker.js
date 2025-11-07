// src/components/RouteTracker.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function RouteTracker() {
    const location = useLocation();

    useEffect(() => {
        const redirectState = { from: location.pathname + location.search };
        localStorage.setItem("lastVisited", JSON.stringify(redirectState));
        // localStorage.setItem("lastVisited", location.pathname + location.search);
    }, [location]);

    return null; // nothing to render
}
