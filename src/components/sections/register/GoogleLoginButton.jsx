import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { googleLogin } from "../../../redux/slices/userSlice";

import { usePostNotification } from "../../../hook/notification/useNotificationQuery";
const GoogleLoginButton = () => {

    const dispatch = useDispatch();
    const{mutate} =usePostNotification();

    const handleCredentialResponse = (response) => {
        const idToken = response.credential;
        console.log("Encoded JWT ID token:", idToken);

        // Dispatch to Redux (calls backend + saves user)
        dispatch(
            googleLogin({
                idToken,
                onSuccess: (loginResponse) => {
                    const userId = loginResponse.id; // or wherever userId is returned
                    const tempId = 4; // replace with your actual template ID for "Login Successful"

                    mutate({ tempId, userId }, {
                        onSuccess: () => {
                            console.log("Login notification sent successfully!");
                        },
                        onError: (err) => {
                            console.error("Failed to send login notification:", err);
                        }
                    });
                }
            })
        );

    };

    useEffect(() => {
        const initializeGoogle = () => {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id:
                        // "1049506168889-0ami0utbl0rg145o5mcebh1h8h0srub4.apps.googleusercontent.com",
                        "900212830464-2lm2h9j2h617d5ijt1dtm4940h3d5q5t.apps.googleusercontent.com",
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
