import PublicUrl from "../api/publicUrl";

export const getLatestBanners = async () => {
    try {
        const res = await PublicUrl.get("latest_collection/list");
        return res.data;
    } catch (err) {
        console.error("Error fetching latest banners:", err);
        throw err;
    }
};
