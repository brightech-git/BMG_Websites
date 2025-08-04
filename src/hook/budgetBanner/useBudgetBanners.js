// src/hook/budgetBanner/useBudgetBanners.js
import { useQuery } from "@tanstack/react-query";
import { getAllBudgetBanners } from "../../service/BudgetCategoryService";

export const useBudgetBanners = () => {
    return useQuery({
        queryKey: ["budget-banners"],
        queryFn: getAllBudgetBanners,
    });
};
