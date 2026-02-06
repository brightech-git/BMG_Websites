
import { useQuery } from "@tanstack/react-query";
import { checkPincodeService } from "../../service/pincodeChecking";

export const useCheckPincode = (destPincode) => {
  return useQuery({
      queryKey: ["destPincode", destPincode],
      queryFn: () => checkPincodeService(destPincode),
      enabled: !!destPincode,
  });
};