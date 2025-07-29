import { useQuery } from "@tanstack/react-query";
import * as FestivalBannerService from '../../service/FestivalBanner';

export const useFestivalBanner = () =>
    useQuery({
        queryKey: ["festivalBanners"],
        queryFn: FestivalBannerService.getAllFestivalBanner,
    }); 