import React, { useEffect } from "react";

const GoogleLoginButton = () => {
    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "1059348243794-8sk2p7vk9vsa6qa8am1krmipa676768t.apps.googleusercontent.com",
            callback: handleCredentialResponse,
        });

        google.accounts.id.renderButton(
            document.getElementById("google-login"),
            { theme: "outline", size: "large" }
        );
    }, []);

    const handleCredentialResponse = (response) => {
        console.log("Encoded JWT ID token: " + response.credential);

        // Decode ID token
        const userData = JSON.parse(atob(response.credential.split(".")[1]));
        console.log("User Info:", userData);

        // Save to localStorage (login/signup)
        localStorage.setItem("user", JSON.stringify(userData));
    };

    return <div id="google-login"></div>;
};

export default GoogleLoginButton;
