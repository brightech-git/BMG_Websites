import PublicUrl from "../api/publicUrl";

const PINCODE_PATTERN = /^\d{6}$/;

export const checkPincodeService = async (destPincode) => {
    const normalizedPincode = String(destPincode || "").trim();
    if (!PINCODE_PATTERN.test(normalizedPincode)) {
        throw new Error("Please enter a valid 6-digit pincode");
    }
    try{
        const response = await PublicUrl.get('/dtdc/pincode-serviceability', {
            params: { destPincode: normalizedPincode }
        });
        return response.data;
       
    }
    catch(error){
        throw new Error(
            error?.response?.data?.message ||
            error?.response?.data?.errorMessage?.errorDesc ||
            error?.message ||
            "Failed to check pincode availability"
        );
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
