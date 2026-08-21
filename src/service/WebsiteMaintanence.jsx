import publicUrl from '../api/publicUrl'; // axios instance with Authorization header

// Add to favorites
export const maintenance = async () => {
  try {
    console.log("Data for payload:");
    const response = await publicUrl.get('/website-maintenance');
    return response.data;
  } catch (err) {
    console.error("Failed to add favorite:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "MAINTANENCE API IS NOT WORKING");
  }
};
