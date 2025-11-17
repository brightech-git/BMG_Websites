import { useQuery } from "@tanstack/react-query";
import { getGenderBanner } from "../../service/GenderBannerService";

export const useGenderBanner = () =>
    useQuery({
        queryKey: ["genderImages"],
        queryFn: getGenderBanner,
    });
