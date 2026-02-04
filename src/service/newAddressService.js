
import PublicUrl from "../api/publicUrl";

// Create Address
export const createAddress = async (addressData) => {
    const { data } = await PublicUrl.post("/addresses/create", addressData);
    return data;
};

export const getAddressByLocation = async (coords) => {
    const response = await PublicUrl.get("/addresses/geocode", {
        params: {
            latitude: coords?.latitude,
            longitude: coords?.longitude,
        },
    });
    return response.data;
};
// Get addresses by customerId
export const getAddressesByCustomer = async (customerId) => {
    const { data } = await PublicUrl.get(`/addresses/customer/${customerId}`);
    return data;
};

// Get single address by ID
export const getAddressById = async (id) => {
    const { data } = await PublicUrl.get(`/addresses/${id}`);
    return data;
};

// Update address
export const updateAddress = async ({ id, addressData }) => {
    const { data } = await PublicUrl.put(`/addresses/update/${id}`, addressData);
    return data;
};

// Delete address
export const deleteAddress = async (id) => {
    const { data } = await PublicUrl.delete(`/addresses/delete/${id}`);
    return data;
};
