import { useQuery } from "@tanstack/react-query";
import * as OccasionBannerService from "../../service/OccasionBannerService";

// Fetch all occasion banners
export const useOccasionBanners = () =>
    useQuery({
        queryKey: ["occasionBanners"],
        queryFn: OccasionBannerService.getAllOccasionBanners,
    });
