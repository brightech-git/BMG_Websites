import PublicUrl from "../api/publicUrl";

export const getAllOfferBanners = () =>
    PublicUrl.get("/offer_banner/list");