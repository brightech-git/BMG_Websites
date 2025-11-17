import PublicUrl from "../api/publicUrl";

export const getGenderBanner = () =>{
    const response =PublicUrl.get("/gender_images/list");
    return response.then((res) => res.data);
    
}