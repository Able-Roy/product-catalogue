/**
 * Shared TypeScript types for the product catalogue backend.
 */

/** A product as returned by the Fake Store API. */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

/** Payload for the POST /api/enquiry endpoint. */
export interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  productId: number;
  productTitle: string;
}

/** Cache entry wrapper. */
export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
