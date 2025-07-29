import * as CategoryBanners from "../../service/CategoryBanners";
import { useQuery } from "@tanstack/react-query";

export const useCategoryBanner = ()=>
     useQuery({
            queryKey: ["categoryBanner"],
            queryFn: CategoryBanners.getAllCategoryBanner,
        });

