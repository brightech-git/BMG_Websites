import PublicUrl from "../api/publicUrl";

// Register
export const registerUser = async (userData) => {
    const response = await PublicUrl.post("auth/user/register", userData);
  
    return response.data;
};

// Login
export const loginUser = async (loginData) => {
    const response = await PublicUrl.post("auth/user/login", loginData);
 
    const data = response.data;

    // If there's an 'error' field, throw it
    if (data.error) {
        throw new Error(data.error); // e.g., "Invalid username or password"
    }

    // Optional: also check for missing token, just in case
    if (!data.token) {
        throw new Error("Login failed: Missing token from server.");
    }

    return data;
};

export const verifyOtpService = async (contactNumber, otp) => {
    const response = await PublicUrl.post(
        `auth/user/verify-otp?contactNumber=${contactNumber}&otp=${otp}`
    );

    const data = response.data;

    if (data.error) {
        throw new Error(data.error);
    }

    return data; // { message, user, token }
};

// Forgot Password (Send OTP via SMS only)
export const forgotPassword = async ({ contactNumber }) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    sessionStorage.setItem(`otp_${contactNumber}`, otp);

    const smsMessage = `BMG JEWELLERS PRIVATE LIMITED: Your OTP for joining our Saving Scheme is ${otp}. It is valid for 10 minutes. Please do not share this code with anyone. BMG JEWELLERS PRIVATE LIMITED.`;

    const params = new URLSearchParams({
        apikey: "dYU7ULuItj9iZQWM",
        senderid: "BMGJEW",
        templateid: "1707174972288335913",
        number: `91${contactNumber}`,
        message: smsMessage,
    });

    try {
        const smsRes = await fetch(`https://sms.textspeed.in/vb/apikey.php?${params.toString()}`);
        const smsText = await smsRes.text();

        // console.log("📨 SMS Response:", smsText);

        if (!smsText.toLowerCase().includes("success")) {
            throw new Error("SMS failed: " + smsText);
        }

        return {
            success: true,
            contactNumber,
            otp, // Dev/debug only, don’t use in prod
        };
    } catch (err) {
        console.error("SMS send error:", err);
        throw new Error("OTP sending failed. Try again.");
    }
};

// Reset Password (OTP check done on frontend)
export const resetPassword = async ({ contactNumber, otp, newPassword }) => {
    const storedOtp = sessionStorage.getItem(`otp_${contactNumber}`);
    if (!storedOtp || storedOtp !== otp) {
        throw new Error("Invalid or expired OTP");
    }

    const response = await PublicUrl.post("auth/user/reset-password", {
        contactNumber,
        newPassword,
    });

    sessionStorage.removeItem(`otp_${contactNumber}`);
    return response.data;
};
