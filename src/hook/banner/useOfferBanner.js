import { useQuery } from "@tanstack/react-query";
import * as  OfferBannerService  from "../../service/OfferBannerService";

export const useOfferBanners = () =>
    useQuery({
        queryKey: ["offerBanners"],
        queryFn: OfferBannerService.getAllOfferBanners,
    }); 
export const useInstantOffer = () => {
    return useQuery({
        queryKey: ["instantOffer"],
        queryFn: OfferBannerService.getInstantOffer,
    });
};
