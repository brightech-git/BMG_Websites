import { useQuery } from "@tanstack/react-query";
import { getGenderBanner } from "../../api/GenderBannerService";

export const useGenderBanner = () =>
    useQuery({
        queryKey: ["genderImages"],
        queryFn: getGenderBanner,
    });
