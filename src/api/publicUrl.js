import axios from "axios";
import { toast } from "react-toastify";
import { logout } from "../redux/slices/userSlice";
import { store } from "../store";

const BASE_URL = 'https://app.bmgjewellers.com/api/v1';
// const BASE_URL = 'http://localhost:8081/api/v1';

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

const getApiErrorMessage = (error) => {
    const message = error?.response?.data?.message;
    return typeof message === "string" && message.trim()
        ? message
        : "Request failed. Please try again.";
};

PublicUrl.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const message = getApiErrorMessage(error);

        if (!error?.config?.skipErrorToast) {
            toast.error(message);
            error.toastHandled = true;
        }

        if (status === 401) {
            localStorage.removeItem("user_token");
            store.dispatch(logout());

            if (window.location.pathname !== "/login") {
                setTimeout(() => {
                    window.location.href = "/login";
                }, 800);
            }
        }

        return Promise.reject(error);
    }
);


export default PublicUrl;
