// src/hooks/useVideoAppointment.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createAppointment,
 
} from "../../service/videoAppointmentService";


// Create appointment
export const useCreateAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries(["appointments"]);
        },
    });
};
