import PublicUrl from "../api/publicUrl";

export const postNotification = async ({ userId, deviceId, deviceType, fcmToken }) => {
  const payload = {
    userId,
    deviceId,
    deviceType,
    fcmToken,
  };

  const res = await PublicUrl.post("/device/register", payload);
  return res.data;
};
