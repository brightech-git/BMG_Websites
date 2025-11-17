import { useQuery } from "@tanstack/react-query";
import {getFeaturedBanners} from '../../service/FeaturedBanner';

export const useFeaturedBanner =() =>{
    return useQuery({
        queryKey:["getFeaturedBanners"],
        queryFn: getFeaturedBanners,
    })
}

