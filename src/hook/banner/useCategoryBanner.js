// src/hooks/useCategoryBanner.js
import { useQuery } from "@tanstack/react-query";
import * as CategoryBannerService from "../../service/CategoryBannerService";

export const useCategoryBanner = ({ itemCtrName, subItemName, pages, occasion, gender }) => {
    return useQuery({
        queryKey: ["categoryBanner", itemCtrName, subItemName],
        queryFn: () => CategoryBannerService.getCategoryBanner({ itemCtrName, subItemName, pages, occasion, gender }),
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


