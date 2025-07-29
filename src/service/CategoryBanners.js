import PublicUrl from "../api/publicUrl";
 
export const getAllCategoryBanner = () =>
    PublicUrl.get("/category_banner/list");