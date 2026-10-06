import categoriesData from '../../public/data/categories.json';
import productsData from '../../public/data/products.json';
import brandsData from '../../public/data/brands.json';

// Re-export data loaded directly from the public JSON files
export const categoriesList = categoriesData;
export const sampleProducts = productsData;
export const brandsList = brandsData;

// Also export asynchronous axios fetching methods
export { fetchProducts, fetchCategories, fetchBrands } from '../services/api';
