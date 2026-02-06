import PublicUrl from "../api/publicUrl";

export const checkPincodeService = async (destPincode) => {
    try{
        const response = await PublicUrl.get('/dtdc/pincode-serviceability',{
            params: { destPincode }
        });
        return response.data;
       
    }
    catch(error){
        console.log(error);
        throw new Error( error , "Failed to check pincode");
    }
}