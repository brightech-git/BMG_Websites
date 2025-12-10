import PublicUrl from "../api/publicUrl";

export const getAdminAddressById = async () => {
    try {
        const response = await PublicUrl.get(`/origin-address/list`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || 'Failed to fetch address');
    }
}