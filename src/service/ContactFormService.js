import { param } from "jquery";
import PublicUrl from "../api/publicUrl";

// Send contact form data
export const sendContactForm = async (formData) => {
    //console.log("Form Data Submitted: ", formData);
    const response = await PublicUrl.post("/contact/submit", null, { params: formData });
    return response.data;
};
