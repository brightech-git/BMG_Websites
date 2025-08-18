import PublicUrl from "../api/publicUrl";

const getCategoryImages = async () => {
    const response = await PublicUrl.get("/mainCategory_images/list");
    return response.data;
};

export default getCategoryImages;
