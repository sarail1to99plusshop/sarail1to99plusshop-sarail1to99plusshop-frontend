import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPaginatedProducts,
  fetchProducts,
  fetchProductById,
  fetchProductReviews,
  submitProductReview,
  fetchCategories,
  fetchDeliveryCharges,
  fetchUserProfileFromDB,
} from '../services/api';

// 1. Paginated Products Hook (default 10 products per page from MongoDB)
export const usePaginatedProducts = ({
  page = 1,
  limit = 10,
  category = 'all',
  tag = 'all',
  search = '',
  sort = 'featured',
} = {}) => {
  return useQuery({
    queryKey: ['products', 'paginated', { page, limit, category, tag, search, sort }],
    queryFn: () =>
      fetchPaginatedProducts({
        page,
        limit,
        category,
        tag,
        search,
        sort,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });
};

// 2. All Products Hook (for Home, BestSelling, NewArrivals, HotOffers from MongoDB)
export const useAllProducts = () => {
  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: fetchProducts,
    staleTime: 1000 * 30,
  });
};

// 3. Single Product Details Hook (from MongoDB)
export const useProductDetails = (id) => {
  return useQuery({
    queryKey: ['product', String(id)],
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 15,
  });
};

// 4. Product Reviews Hook (from MongoDB)
export const useProductReviews = (productId) => {
  return useQuery({
    queryKey: ['productReviews', Number(productId)],
    queryFn: () => fetchProductReviews(productId),
    enabled: Boolean(productId),
    staleTime: 1000 * 10,
  });
};

// 5. Submit Product Review Mutation (Dynamically updates product stars & review count in MongoDB)
export const useAddReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, reviewData }) =>
      submitProductReview(productId, reviewData),
    onSuccess: (data, variables) => {
      const pid = Number(variables.productId);

      // Immediately update product cache with new dynamic rating & review count
      if (data?.averageRating !== undefined) {
        queryClient.setQueryData(['product', String(pid)], (oldProd) =>
          oldProd
            ? {
                ...oldProd,
                rating: data.averageRating,
                reviews: data.totalReviews,
              }
            : oldProd
        );

        queryClient.setQueryData(['products', 'all'], (oldList) =>
          Array.isArray(oldList)
            ? oldList.map((p) =>
                p.id === pid
                  ? {
                      ...p,
                      rating: data.averageRating,
                      reviews: data.totalReviews,
                    }
                  : p
              )
            : oldList
        );
      }

      // Invalidate queries to refetch fresh state from MongoDB backend
      queryClient.invalidateQueries({ queryKey: ['productReviews', pid] });
      queryClient.invalidateQueries({ queryKey: ['product', String(pid)] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// 6. Categories Hook (from MongoDB)
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });
};

// 7. Delivery Charges Hook (from Backend API)
export const useDeliveryCharges = () => {
  return useQuery({
    queryKey: ['deliveryCharges'],
    queryFn: fetchDeliveryCharges,
    staleTime: 1000 * 60 * 5,
  });
};

// 8. MongoDB User Profile Hook (includes registeredAt & lastLoginAt)
export const useUserProfile = (uidOrEmail) => {
  return useQuery({
    queryKey: ['userProfile', uidOrEmail],
    queryFn: () => fetchUserProfileFromDB(uidOrEmail),
    enabled: Boolean(uidOrEmail),
    staleTime: 1000 * 10,
  });
};
