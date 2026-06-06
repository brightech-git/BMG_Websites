// src/hooks/useCategoryBanner.js
import { useQuery } from "@tanstack/react-query";
import * as CategoryBannerService from "../../service/CategoryBannerService";

export const useCategoryBanner = ({ ItemName, subItemName, pages, occasion, gender }) => {
    return useQuery({
        queryKey: ["categoryBanner", ItemName, subItemName],
        queryFn: () => CategoryBannerService.getCategoryBanner({ ItemName, subItemName, pages, occasion, gender }),
        select: (res) => {
            // return null if no images
            if (res) {
                return res.data;
            } else {
                return null;
            }
        },
    });
};


