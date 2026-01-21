import { useQuery } from "@tanstack/react-query";
import { getSchemeDetails } from "../../service/schemeDetails";



export const useSchemeDetails = (params) => {
    return useQuery({
        queryKey: ["schemeDetails", params],
        queryFn: () => getSchemeDetails(params),
    
    });
};
