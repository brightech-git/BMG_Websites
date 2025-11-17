import PublicUrl from "../api/publicUrl";

export const getBestDesignedBanners = async () => {
    try {
        const res = await PublicUrl.get("best_design/list");
        return res.data;
    } catch (err) {
        console.error("Error fetching latest banners:", err);
        throw err;
    }
};
