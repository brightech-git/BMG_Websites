import { useQuery } from "@tanstack/react-query";
import * as  OfferBannerService  from "../../service/OfferBannerService";

export const useOfferBanners = () =>
    useQuery({
        queryKey: ["offerBanners"],
        queryFn: OfferBannerService.getAllOfferBanners,
    }); 