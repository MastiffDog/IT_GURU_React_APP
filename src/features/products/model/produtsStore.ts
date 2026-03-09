// src/features/ProductsTable/model/store.ts

import { create } from 'zustand';
import { fetchProducts, searchProducts } from './productsApi';

type Product = {
  id: number;
  title: string;
  brand?: string;
  sku?: string;
  rating?: number;
  price: number;
  stock?: number;
};

type Pagination = {
  currentPage: number;
  totalPages: number;
};

type SortSettings = {
  column: string;
  direction: 'asc' | 'desc';
};

type State = {
  products: Product[];
  pagination: Pagination;
  searchTerm: string;
  isSearchActive: boolean;
  sortSettings: SortSettings | null;
  loading: boolean;
};

type Actions = {
  loadProductsNormal(): Promise<void>;
  loadProductsSearch(term: string, page?: number): Promise<void>;
  changePage(page: number): void;
  toggleSearchMode(active: boolean): void;
  setSearchTerm(term: string): void;
  updateSort(settings: SortSettings): void;
  clearSearch(): void;
};

const initialState: State = {
  products: [],
  pagination: { currentPage: 1, totalPages: 1 },
  searchTerm: '',
  isSearchActive: false,
  sortSettings: null,
  loading: true,
};

// Включаем get для чтения текущего состояния внутри методов
export const useProductStore = create<State & Actions>((set, get) => ({
  ...initialState,

  // Загрузка обычных товаров
  loadProductsNormal: async () => {
    const state = get();
    const limit = 5;
    const skip = (state.pagination.currentPage - 1) * limit;

    const params: { limit: number; skip: number; sortBy?: string; order?: 'asc' | 'desc' } = {
      limit,
      skip,
    };

    if (state.sortSettings) {
      params.sortBy = state.sortSettings.column;
      params.order = state.sortSettings.direction;
    }

    try {
      const data = await fetchProducts(params);
      // Ожидаем структуры { products, total }
      const products = data?.products ?? [];
      const total = data?.total ?? 0;

      set((s) => ({
        ...s,
        products,
        pagination: { ...s.pagination, totalPages: Math.ceil(total / limit) },
        loading: false,
      }));
    } catch {
      set((s) => ({
        ...s,
        loading: false,
      }));
    }
  },

  // Загрузка товаров по поиску
  loadProductsSearch: async (term: string, page: number = 1) => {
    const limit = 5;
    const skip = (page - 1) * limit;

    try {
      const data = await searchProducts({ q: term, limit, skip });
      const products = data?.products ?? [];
      const total = data?.total ?? 0;

      const state = get();
      set((s) => ({
        ...s,
        products,
        pagination: { ...state.pagination, currentPage: page, totalPages: Math.ceil(total / limit) },
        loading: false,
      }));
    } catch {
      set((s) => ({
        ...s,
        loading: false,
      }));
    }
  },

  // Обновление страницы
  changePage: (page: number) =>
    set((state) => ({
      ...state,
      pagination: {
        ...state.pagination,
        currentPage: page,
      },
    })),

  // Изменение режима поиска
  toggleSearchMode: (active: boolean) =>
    set((state) => ({
      ...state,
      isSearchActive: active,
    })),

  // Установить поисковый термин
  setSearchTerm: (term: string) =>
    set((state) => ({
      ...state,
      searchTerm: term,
    })),

  // Настройка сортировки
  updateSort: (settings: SortSettings) =>
    set((state) => ({
      ...state,
      sortSettings: settings,
    })),

  // Удаление предыдущего поиска
  clearSearch: () =>
    set((state) => ({
      ...state,
      searchTerm: '',
      isSearchActive: false,
    })),
}));
