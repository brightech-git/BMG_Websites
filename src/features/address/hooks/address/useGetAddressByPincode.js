import { useQuery } from "@tanstack/react-query";
import { getAddressesByPincode } from "../../api/AddressService";

export const useAddressesByPincode = (pincode) => {
  return useQuery({
    queryKey: ['addresses', pincode],
    queryFn: () => getAddressesByPincode(pincode),
    enabled: !!pincode,
  });
};