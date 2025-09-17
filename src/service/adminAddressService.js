import PublicUrl from "../api/publicUrl";

export const getAdminAddressById = async (id) => {
    try {
        const response = await PublicUrl.get(`/origin-address/get/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || 'Failed to fetch address');
    }
}