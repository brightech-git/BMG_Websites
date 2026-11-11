import { useMutation } from "@tanstack/react-query";
import { postNotification } from "../../api/NotificationService";
import pushNotification from "../../api/NotificationService";

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

