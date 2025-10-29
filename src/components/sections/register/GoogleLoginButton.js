import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { googleLogin } from "../../../redux/slices/userSlice";


const GoogleLoginButton = () => {

    const dispatch = useDispatch();
    const handleCredentialResponse = (response) => {
        const idToken = response.credential;
        console.log("Encoded JWT ID token:", idToken);

        // Dispatch to Redux (calls backend + saves user)
        dispatch(googleLogin(idToken));
    };

    useEffect(() => {
        const initializeGoogle = () => {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id:
                        "1049506168889-0ami0utbl0rg145o5mcebh1h8h0srub4.apps.googleusercontent.com",
                    callback: handleCredentialResponse,
                });

                window.google.accounts.id.renderButton(
                    document.getElementById("google-login"),
                    { theme: "outline", size: "large" }
                );
            }
        };

        // If script already loaded
        if (window.google && window.google.accounts) {
            initializeGoogle();
        } else {
            // Wait until the script is ready
            window.addEventListener("google-loaded", initializeGoogle);
        }

        return () => {
            window.removeEventListener("google-loaded", initializeGoogle);
        };
    }, []);

    return <div id="google-login"></div>;
};

export default GoogleLoginButton;
