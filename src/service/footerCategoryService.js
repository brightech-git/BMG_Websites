import PublicUrl from "../api/publicUrl";

const getFooterContent = async() =>{
    try{
        const response = await PublicUrl.get('/footer');
        return response.data;
    }
    catch(err){
        throw new Error("Failed to get the Content")
    }
   
}
export default getFooterContent;