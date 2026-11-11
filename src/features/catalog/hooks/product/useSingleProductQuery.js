import { useQuery } from '@tanstack/react-query';
import { getProductByTagKey ,getWhatsappLink} from '../../api/ProductService';

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


