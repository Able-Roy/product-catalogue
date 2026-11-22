import axios from 'axios';
import config from '../config';
import { Product, CacheEntry } from '../types';

/** In-memory cache keyed by cache key string. */
const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Returns a cached value if still valid, otherwise fetches fresh data.
 */
function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && Date.now() < entry.expiresAt) {
    return entry.data;
  }
  return null;
}

/**
 * Stores a value in the cache with the configured TTL.
 */
function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + config.cacheTtlMs });
}

/**
 * Fetches all products from the Fake Store API, with caching.
 * @returns Array of all products
 */
export async function getAllProducts(): Promise<Product[]> {
  const key = 'all_products';
  const cached = getFromCache<Product[]>(key);
  if (cached) return cached;

  const { data } = await axios.get<Product[]>(`${config.fakeStoreBaseUrl}/products`);
  setCache(key, data);
  return data;
}

/**
 * Fetches a single product by ID from the Fake Store API, with caching.
 * @param id - The product ID
 * @returns The product, or null if not found
 */
export async function getProductById(id: number): Promise<Product | null> {
  const key = `product_${id}`;
  const cached = getFromCache<Product>(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get<Product>(`${config.fakeStoreBaseUrl}/products/${id}`);
    if (!data || !data.id) return null;
    setCache(key, data);
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return null;
    throw err;
  }
}

/**
 * Returns the top 5 products sorted by rating.rate descending.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return [...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 5);
}

/**
 * Searches products by title, description, or category (case-insensitive).
 * @param query - The search term
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getAllProducts();
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
  );
}

/**
 * Returns all unique product categories.
 */
export async function getCategories(): Promise<string[]> {
  const key = 'categories';
  const cached = getFromCache<string[]>(key);
  if (cached) return cached;

  const { data } = await axios.get<string[]>(`${config.fakeStoreBaseUrl}/products/categories`);
  setCache(key, data);
  return data;
}

/**
 * Returns all products in a category, sorted by rating.rate descending.
 * @param category - The category name
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const key = `category_${category}`;
  const cached = getFromCache<Product[]>(key);
  if (cached) return cached;

  const { data } = await axios.get<Product[]>(
    `${config.fakeStoreBaseUrl}/products/category/${encodeURIComponent(category)}`,
  );
  const sorted = [...data].sort((a, b) => b.rating.rate - a.rating.rate);
  setCache(key, sorted);
  return sorted;
}

/** Clears the in-memory cache (useful for tests). */
export function clearCache(): void {
  cache.clear();
}
