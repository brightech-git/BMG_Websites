import { useMutation } from "@tanstack/react-query";
import { sendContactForm } from "../../service/ContactFormService";

export const useContactFormQuery = () => {
    return useMutation({
        mutationFn: (formData) => sendContactForm(formData),
        retry: false, // no retry for form submissions
    });
};
