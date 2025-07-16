/**
 * API Utility Functions for Products
 * 
 * This file contains all API-related functions for product management.
 * It provides a clean separation between API logic and component logic.
 */

// Types
export interface Product {
  id: number;
  image: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  inventory: number;
  status: string;
  rating: number;
  orders: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';
const API_VERSION = 'v1';
const BASE_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// API Endpoints
export const API_ENDPOINTS = {
  products: '/products',
  product: (id: number) => `/products/${id}`,
  productsByCategory: (category: string) => `/products?category=${category}`,
  searchProducts: (query: string) => `/products?search=${query}`,
};

// Utility function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: getAuthHeaders(),
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || 
        `HTTP error! status: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Product API Functions
export const productApi = {
  // Get all products
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Product>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const endpoint = `${API_ENDPOINTS.products}?${queryParams.toString()}`;
    return apiRequest<PaginatedResponse<Product>>(endpoint);
  },

  // Get single product by ID
  getProduct: async (id: number): Promise<Product> => {
    return apiRequest<Product>(API_ENDPOINTS.product(id));
  },

  // Create new product
  createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    return apiRequest<Product>(API_ENDPOINTS.products, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update existing product
  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    return apiRequest<Product>(API_ENDPOINTS.product(id), {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Partially update product
  patchProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    return apiRequest<Product>(API_ENDPOINTS.product(id), {
      method: 'PATCH',
      body: JSON.stringify(productData),
    });
  },

  // Delete product
  deleteProduct: async (id: number): Promise<void> => {
    return apiRequest<void>(API_ENDPOINTS.product(id), {
      method: 'DELETE',
    });
  },

  // Bulk operations
  bulkDelete: async (ids: number[]): Promise<void> => {
    return apiRequest<void>(`${API_ENDPOINTS.products}/bulk-delete`, {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  },

  bulkUpdate: async (updates: Array<{ id: number; data: Partial<Product> }>): Promise<Product[]> => {
    return apiRequest<Product[]>(`${API_ENDPOINTS.products}/bulk-update`, {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    });
  },

  // Search products
  searchProducts: async (query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }): Promise<Product[]> => {
    const queryParams = new URLSearchParams({ search: query });
    
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters?.inStock !== undefined) queryParams.append('inStock', filters.inStock.toString());
    
    const endpoint = `${API_ENDPOINTS.products}/search?${queryParams.toString()}`;
    return apiRequest<Product[]>(endpoint);
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    return apiRequest<Product[]>(API_ENDPOINTS.productsByCategory(category));
  },

  // Update product inventory
  updateInventory: async (id: number, inventory: number): Promise<Product> => {
    return apiRequest<Product>(`${API_ENDPOINTS.product(id)}/inventory`, {
      method: 'PATCH',
      body: JSON.stringify({ inventory }),
    });
  },

  // Update product status
  updateStatus: async (id: number, status: string): Promise<Product> => {
    return apiRequest<Product>(`${API_ENDPOINTS.product(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Error handling utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Response transformers (use these if your API response format differs)
export const transformers = {
  // Transform API product to component product format
  transformProduct: (apiProduct: any): Product => ({
    id: apiProduct.id,
    image: apiProduct.image || '/placeholder.svg',
    name: apiProduct.name || '',
    description: apiProduct.description || '',
    sku: apiProduct.sku || '',
    category: apiProduct.category || '',
    price: apiProduct.price || 0,
    inventory: apiProduct.inventory || 0,
    status: apiProduct.status || 'Draft',
    rating: apiProduct.rating || 0,
    orders: apiProduct.orders || 0,
  }),

  // Transform API response to paginated format
  transformPaginatedResponse: (apiResponse: any): PaginatedResponse<Product> => ({
    data: apiResponse.data?.map(transformers.transformProduct) || [],
    total: apiResponse.total || 0,
    page: apiResponse.page || 1,
    limit: apiResponse.limit || 10,
    totalPages: apiResponse.totalPages || 0,
  }),
};

// Usage example:
/*
import { productApi } from '@/utils/api';

// In your component:
const fetchProducts = async () => {
  try {
    const response = await productApi.getProducts({ page: 1, limit: 10 });
    setProducts(response.data);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};
*/ 