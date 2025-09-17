import PublicUrl from "../api/publicUrl";

export const headerNavData = async() =>{
    const response = await PublicUrl.get("/menu/list");
    return response.data
}