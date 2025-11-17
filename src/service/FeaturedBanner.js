import PublicUrl from "../api/publicUrl";

export const getFeaturedBanners = async() =>{
    try{
        const res = await PublicUrl.get('feature_product/list');
        return res.data;
    }
    catch(err){
        console.error("Error fetching latest banners:", err);
       throw err;
    }
}

