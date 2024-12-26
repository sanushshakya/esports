import { api } from './api';

export const buyProduct = async (productId: number) => {
  try {
    const {data} = await api.post(`/product/${productId}/buy_product/`);
    return data;
  } catch (error: any) {
    alert(error.response.data.error);
  }
};