import { useMutation } from "@tanstack/react-query";
import { postNotification } from "../../service/NotificationService";

// Custom hook for registering device
export const useNotification = () => {
  return useMutation({
    mutationFn: ({ userId, deviceId, deviceType, fcmToken }) =>
      postNotification({ userId, deviceId, deviceType, fcmToken }),
  });
};
