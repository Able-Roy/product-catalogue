import apiClient from './client';
import type { Product } from '../types';

/** Fetch all products */
export async function getProducts(): Promise<Product[]> {
  const res = await apiClient.get<Product[]>('/products');
  return res.data;
}

/** Fetch top-rated (featured) products */
export async function getFeaturedProducts(): Promise<Product[]> {
  const res = await apiClient.get<Product[]>('/products/featured');
  return res.data;
}

/** Fetch all category strings */
export async function getCategories(): Promise<string[]> {
  const res = await apiClient.get<string[]>('/products/categories');
  return res.data;
}

/** Fetch products in a specific category */
export async function getProductsByCategory(name: string): Promise<Product[]> {
  const res = await apiClient.get<Product[]>(`/products/category/${encodeURIComponent(name)}`);
  return res.data;
}

/** Search products by query string */
export async function searchProducts(q: string): Promise<Product[]> {
  const res = await apiClient.get<Product[]>('/products/search', { params: { q } });
  return res.data;
}

/** Fetch a single product by id */
export async function getProduct(id: number): Promise<Product> {
  const res = await apiClient.get<Product>(`/products/${id}`);
  return res.data;
}
