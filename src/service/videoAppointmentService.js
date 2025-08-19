// src/service/videoAppointmentService.js
import PublicUrl from "../api/publicUrl";

// Create appointment
export const createAppointment = async (appointment) => {
    const { data } = await PublicUrl.post("/video-appointments/upload", appointment);
    return data;
};
