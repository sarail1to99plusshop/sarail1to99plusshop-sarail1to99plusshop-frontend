import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPaginatedProducts,
  fetchProducts,
  fetchProductById,
  fetchProductReviews,
  submitProductReview,
  fetchCategories,
  fetchDeliveryCharges,
  fetchDistricts,
  fetchDivisions,
  fetchUserProfileFromDB,
  fetchUserOrdersFromDB,
  cancelOrderInDB,
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

// 7b. Bangladesh 64 Districts Hook (from Express Backend API)
export const useDistricts = (division = '') => {
  return useQuery({
    queryKey: ['districts', division],
    queryFn: () => fetchDistricts(division),
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
};

// 7c. Bangladesh 8 Divisions Hook (from Express Backend API)
export const useDivisions = () => {
  return useQuery({
    queryKey: ['divisions'],
    queryFn: fetchDivisions,
    staleTime: 1000 * 60 * 60,
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

// 9. User Order History Hook (fetches all orders for the logged-in user from MongoDB)
export const useUserOrders = ({ email = '', userId = '', phone = '' } = {}) => {
  return useQuery({
    queryKey: ['userOrders', email?.toLowerCase() || '', userId || '', phone || ''],
    queryFn: () => fetchUserOrdersFromDB({ email, userId, phone }),
    enabled: Boolean(email || userId || phone),
    staleTime: 1000 * 10,
  });
};

// 10. Cancel User Order Mutation Hook
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoiceNumber) => cancelOrderInDB(invoiceNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
    },
  });
};
