import { useQuery } from "@tanstack/react-query";
import { paymentOptions} from "../../api/paymentService";

export function usePayments(){
    return useQuery({
        queryKey : ['paymentOptions'],
        queryFn : paymentOptions
    })
}