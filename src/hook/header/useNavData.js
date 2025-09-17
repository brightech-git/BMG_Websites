import { headerNavData } from "../../service/HeaderNavService";
import { useQuery } from "@tanstack/react-query";

export const useHeaderData =()=>{
    return useQuery({
        queryKey:["headerNavData"],
        queryFn:headerNavData,
        refetchOnWindowFocus:false,
        retry:false,
        enabled:true,
    })
}