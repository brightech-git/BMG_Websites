import { useQuery } from "@tanstack/react-query";
import getCategoryImages from "../../api/CategoryImageService";

export const useCategoryImages = () =>
    useQuery({
        queryKey: ["categoryImages"],
        queryFn: getCategoryImages,
    });
