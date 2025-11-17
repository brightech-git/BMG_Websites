
import { useQuery } from "@tanstack/react-query";
import { getBestDesignedBanners } from "../../service/BestDesignedBanner";

export const useBestDesignedBanners = () => {
    return useQuery({
        queryKey: ["getBestDesignedBanner"],
        queryFn: getBestDesignedBanners, // ✅ match name
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
