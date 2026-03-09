import axios from 'axios';

interface FetchParams {
  limit: number;
  skip: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

interface SearchParams {
  q: string;
  limit: number;
  skip: number;
}

export const fetchProducts = async (params: FetchParams): Promise<any> => {
  const response = await axios.get('https://dummyjson.com/products', { params });
  return response.data;
};

export const searchProducts = async (params: SearchParams): Promise<any> => {
  const response = await axios.get('https://dummyjson.com/products/search', { params });
  return response.data;
};