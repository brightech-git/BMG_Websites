import axios from "axios";
import PublicUrl from "../api/publicUrl";


const createAddress = async (addressData) => {
    const response = await PublicUrl.post('/addresses/create', addressData);
    return response.data;
};

const getAddressesByCustomer = async (customerId) => {
    const response = await PublicUrl.get(`/addresses/customer/${customerId}`);
    return response.data;
};

const getAddressById = async (id) => {
    const response = await PublicUrl.get(`/addresses/${id}`);
    return response.data;
};

const updateAddress = async (id, addressData) => {
    const response = await PublicUrl.put(`/addresses/update/${id}`, addressData);
    return response.data;
};

const deleteAddress = async (id) => {
    const response = await PublicUrl.delete(`/addresses/delete/${id}`);
    return response.data;
};

export const getAddressesByPincode = async(pincode)=>{
    try{
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        console.log(response.data);
        return response.data
    }
    catch(err){
        console.error('Error fetching addresses by pincode:', err);
        throw new Error('Failed to fetch addresses by pincode');
    }
}

export const addressService = {
    createAddress,
    getAddressesByCustomer,
    getAddressById,
    updateAddress,
    deleteAddress,
};
