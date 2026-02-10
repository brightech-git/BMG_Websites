// src/hook/product/useSingleProductQuery.js
import { useQuery } from '@tanstack/react-query';
import { getProductByTagKey ,getWhatsappLink} from '../../service/ProductService';

export const useSingleProductQuery = (tagKey) => {
    return useQuery({
        queryKey: ['singleProduct', tagKey],
        queryFn: () => getProductByTagKey((tagKey)),
        enabled: !!tagKey,
    });
};

export const useWhatsappLink = (sno) => {
    return useQuery({
        queryKey: ['links', sno],
        queryFn: () => getWhatsappLink((sno)),
        enabled: !!sno,
    });
};


