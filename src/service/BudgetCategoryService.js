// src/service/BudgetCategoryService.js
import PublicUrl from "../api/publicUrl";

export const getAllBudgetBanners = async () => {
    const response = await PublicUrl.get("/budget-categories/all");
    return response.data;
};
