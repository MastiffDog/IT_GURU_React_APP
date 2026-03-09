export interface Product {
  id: number;
  title: string;
  brand?: string;
  sku?: string;
  rating?: number;
  price: number;
  stock?: number;
}

export interface Params {
  limit: number;
  skip: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
}

export interface SortSettings {
  column: string;
  direction: 'asc' | 'desc';
}