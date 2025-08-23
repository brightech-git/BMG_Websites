import PublicUrl from "../api/publicUrl";

export const getAllOfferBanners = () =>
    PublicUrl.get("/offer_banner/list");

export const getInstantOffer = () => {
    return PublicUrl.get('/instant_offers/list')
        .then((res) => res.data)   // ✅ make sure to return the data
        .catch((err) => {
            console.error("Error fetching instant offers:", err);
            throw err; // let react-query handle error state
        });
};
