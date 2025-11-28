import { useMutation } from "@tanstack/react-query";
import { postNotification } from "../../service/NotificationService";
import pushNotification from "../../service/NotificationService";

// Custom hook for registering device
export const useNotification = () => {
  return useMutation({
    mutationFn: ({ userId, deviceId, deviceType, fcmToken }) =>
      postNotification({ userId, deviceId, deviceType, fcmToken }),
  });
};

export const usePostNotification = () => {
  return useMutation({
    mutationFn: ({ tempId,userId }) =>
      pushNotification({ tempId,userId}),
  });
};

