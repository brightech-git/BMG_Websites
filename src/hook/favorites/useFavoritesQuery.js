import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getFavorites,
    addFavorite,
    removeFavorite,
} from '../../service/favoriteService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';


export const useFavorites = () => {
    const queryClient = useQueryClient();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    const { data, isLoading } = useQuery({
        queryKey: ['favorites'],
        queryFn: getFavorites,
        enabled: !!isAuthenticated,
    });

    const favorites = data?.data?.products || [];
    const favoritesCount = favorites.length;

    const addMutation = useMutation({
        mutationFn: addFavorite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            toast.success("❤️ Added to wishlist!");
        },
        onError: () => {
            toast.error("Failed to add to wishlist.");
        }
    });

    const removeMutation = useMutation({
        mutationFn: removeFavorite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            toast.success("Removed from wishlist.");
        },
        onError: () => {
            toast.error("Failed to remove item.");
        }
    });

    const handleAddFavorite = (item) => {
        if (!isAuthenticated) {
            toast.info("Please login first.");
            return;
        }

        if (!item?.TAGKEY) {
            toast.error("Invalid product.");
            return;
        }

        const alreadyExists = favorites.some(
            fav => String(fav.TAGKEY) === String(item.TAGKEY)
        );

        if (alreadyExists) {
            toast.warning("Item already in wishlist!");
            return;
        }

        addMutation.mutate({
            tagKey: item.TAGKEY,
            quantity: 1
        });
    };

    const handleRemoveFavorite = (tagKey) => {
        removeMutation.mutate(tagKey);
    };

    const isFavorite = (tagKey) => {
        return favorites.some(
            fav => String(fav.TAGKEY) === String(tagKey)
        );
    };

    return {
        favorites,
        favoritesCount,   // ✅ added
        isLoading,
        addToFavorite: handleAddFavorite,
        removeFavorite: handleRemoveFavorite,
        isFavorite,
    };
};
