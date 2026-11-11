import { useQuery } from "@tanstack/react-query";
import { getAllBudgetBanners } from "../../api/BudgetCategoryService";

export const useBudgetBanners = () => {
    return useQuery({
        queryKey: ["budget-banners"],
        queryFn: getAllBudgetBanners,
    });
};
