import PublicUrl from "../api/publicUrl";

// GET all occasion banners
export const getAllOccasionBanners = () =>
    PublicUrl.get("/occasion_banner/list");

