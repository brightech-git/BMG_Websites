// src/hook/product/useSingleProductQuery.js
import { useQuery } from '@tanstack/react-query';
import { getProductBySno ,getWhatsappLink} from '../../service/ProductService';

export const useSingleProductQuery = (sno) => {
    return useQuery({
        queryKey: ['singleProduct', sno],
        queryFn: () => getProductBySno((sno)),
        enabled: !!sno,
    });
};

export const useWhatsappLink = (sno) => {
    return useQuery({
        queryKey: ['links', sno],
        queryFn: () => getWhatsappLink((sno)),
        enabled: !!sno,
    });
};


