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

export const checkShippingPrice = async (destinationPincode, weightInGrams) => {
    try {
        console.log(destinationPincode, weightInGrams, 'finalPincode, totalWeight')
        const response = await PublicUrl.get('/shipping/calculate', {
            params: { destinationPincode, weightInGrams }
        });
        console.log(response,'finalPincode, totalWeight')
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error(
            error?.response?.data?.message || "Failed to check pincode"
        );
    }
};
