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

export const useItemFilter = ({ itemId, ItemName, page = 1, pageSize = 20 }) => {
  return useQuery({
    queryKey: ['itemFilter', itemId, ItemName, page, pageSize],
    queryFn: () => getItemFilter({
      itemId: itemId ? itemId.toString() : undefined,
      ItemName: ItemName ? ItemName.trim() : undefined,
      page,
      pageSize
    }),
    enabled: !!itemId || !!ItemName,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000
  });
};