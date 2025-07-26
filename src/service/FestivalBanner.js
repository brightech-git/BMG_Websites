import PublicUrl from "../api/publicUrl";

// GET all occasion banners
export const getAllFestivalBanner = () =>
    PublicUrl.get("/festival_banner/list");

