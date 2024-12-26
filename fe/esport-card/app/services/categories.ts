// services/category.ts
import { api } from './api';

export const getCategories = async () => {
  try {
    const { data } = await api.get('/category/get_categories_with_products/');
    return data;
  } catch (error:any) {
    alert(error.response.data.error);
  }
};