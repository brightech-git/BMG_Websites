import PublicUrl from "../api/publicUrl";

export const getCompanyDetails = async () => {
    try {
        const response = await PublicUrl.get('/company');
        if (response.data) {
            return response.data;
        }
        return null;
    } catch (err) {
        throw new Error("Failed to get the Company Details");
    }
};
