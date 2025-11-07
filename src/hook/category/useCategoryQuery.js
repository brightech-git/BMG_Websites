import { useQuery } from '@tanstack/react-query';
import { getItemFilter } from '../../service/CategoryItemsService';
import { getCategory } from '../../service/CategoryItemsService';



export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategory(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useItemFilter = ({ itemId, itemCtrName, page = 1, pageSize = 20 }) => {
  return useQuery({
    queryKey: ['itemFilter', itemId, itemCtrName, page, pageSize],
    queryFn: () => getItemFilter({
      itemId: itemId ? itemId.toString() : undefined,
      itemCtrName: itemCtrName ? itemCtrName.trim() : undefined,
      page,
      pageSize
    }),
    enabled: !!itemId || !!itemCtrName,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000
  });
};