import categoriesData from '../../public/data/categories.json';
import productsData from '../../public/data/products.json';
import brandsData from '../../public/data/brands.json';
import deliveryChargesData from '../../public/data/deliveryCharges.json';

// Re-export data loaded directly from the public JSON files
export const categoriesList = categoriesData;
export const sampleProducts = productsData;
export const brandsList = brandsData;
export const deliveryChargesList = deliveryChargesData;

// Also export asynchronous axios fetching methods
export {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  fetchBrands,
  fetchDeliveryCharges,
} from '../services/api';

