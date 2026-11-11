// 🧩 useLatestBanner.ts
import { useQuery } from "@tanstack/react-query";
import { getLatestBanners } from "../../api/LatestBannerService";

export const useLatestBanner = () => {
    return useQuery({
        queryKey: ["getLatestBanner"],
        queryFn: getLatestBanners, // ✅ match name
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
