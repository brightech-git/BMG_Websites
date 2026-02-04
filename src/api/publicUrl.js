import axios from "axios";
import { toast } from "react-toastify";
import { logout } from "../redux/slices/userSlice";
import { store } from "../store";

const BASE_URL = 'https://app.bmgjewellers.com/api/v1';

const PublicUrl = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // keep true if backend uses cookies/session
    
});

/* ======================
   REQUEST INTERCEPTOR
   ====================== */
PublicUrl.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("user_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* ======================
   RESPONSE INTERCEPTOR
   ====================== */
PublicUrl.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
            toast.error("Session expired. Please login again.");

            // 🔥 Clear auth
            localStorage.removeItem("user_token");
            store.dispatch(logout());

            // 🔥 Redirect after short delay
            setTimeout(() => {
                window.location.href = "/login";
            }, 800);
        }

        return Promise.reject(error);
    }
);


export default PublicUrl;
