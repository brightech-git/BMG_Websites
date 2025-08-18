import { useQuery } from "@tanstack/react-query";
import getCategoryImages from "../../service/CategoryImageService";

export const useCategoryImages = () =>
    useQuery({
        queryKey: ["categoryImages"],
        queryFn: getCategoryImages,
    });
