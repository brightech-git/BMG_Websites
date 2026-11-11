import { useQuery } from "@tanstack/react-query";
import { getSchemeDetails } from "../../api/schemeDetails";



export const useSchemeDetails = (params) => {
    return useQuery({
        queryKey: ["schemeDetails", params],
        queryFn: () => getSchemeDetails(params),
    
    });
};
