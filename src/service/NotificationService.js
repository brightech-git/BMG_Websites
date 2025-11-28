import PublicUrl from "../api/publicUrl";

export const postNotification = async ({ userId, deviceId, deviceType, fcmToken }) => {
  const payload = {
    userId,
    deviceId,
    deviceType,
    fcmToken,
  };
  console.log({...payload}, 'payload')

  const res = await PublicUrl.post("/device/register", payload);
  return res.data;
};


const pushNotification = async ({tempId ,userId}) => {
  try {
    console.log(tempId,userId, 'pushdata');
    const response = await PublicUrl.post(
      `/notifications/send/template/${tempId}/user/${userId}`,

    );
    console.log(response.data, 'data');
    return response.data;

  } catch (error) {
    console.error("Push notification error:", error);
    throw error;
  }
};

export default pushNotification;