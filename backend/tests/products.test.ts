import request from 'supertest';
import app from '../src/app';
import * as fakeStoreService from '../src/services/fakeStoreService';
import { Product } from '../src/types';

// Mock the entire fakeStoreService so tests run offline
jest.mock('../src/services/fakeStoreService');

const mockFakeStore = fakeStoreService as jest.Mocked<typeof fakeStoreService>;

/** Sample products covering different categories and ratings */
const sampleProducts: Product[] = [
  {
    id: 1,
    title: 'Fjallraven Backpack',
    price: 109.95,
    description: 'Your perfect pack for everyday use',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fAn.jpg',
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 22.3,
    description: 'Slim-fit originals',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71.jpg',
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: 'Womens Dress',
    price: 7.95,
    description: 'Great summer dress',
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/71.jpg',
    rating: { rate: 2.6, count: 5 },
  },
  {
    id: 4,
    title: 'Samsung 49-Inch TV',
    price: 399.99,
    description: 'Samsung 49-Inch CHG90 144Hz Curved',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/81.jpg',
    rating: { rate: 2.2, count: 140 },
  },
  {
    id: 5,
    title: 'Solid Gold Petite Micropavé',
    price: 168,
    description: 'Satisfaction Guaranteed.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/61.jpg',
    rating: { rate: 3.9, count: 70 },
  },
  {
    id: 6,
    title: 'White Gold Plated Princess',
    price: 9.99,
    description: 'Classic jewelry piece.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71.jpg',
    rating: { rate: 3.0, count: 400 },
  },
  {
    id: 7,
    title: 'Pierced Owl Rose Gold Plated',
    price: 10.99,
    description: 'Rose gold earrings.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/51.jpg',
    rating: { rate: 1.9, count: 100 },
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/products', () => {
  it('returns all products', async () => {
    mockFakeStore.getAllProducts.mockResolvedValue(sampleProducts);

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(sampleProducts.length);
  });
});

describe('GET /api/products/featured', () => {
  it('returns exactly 5 products sorted by rating.rate descending', async () => {
    // getFeaturedProducts is mocked — return the top 5 ourselves
    const featured = [...sampleProducts]
      .sort((a, b) => b.rating.rate - a.rating.rate)
      .slice(0, 5);
    mockFakeStore.getFeaturedProducts.mockResolvedValue(featured);

    const res = await request(app).get('/api/products/featured');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);

    // Verify descending order
    const rates: number[] = res.body.map((p: Product) => p.rating.rate);
    for (let i = 0; i < rates.length - 1; i++) {
      expect(rates[i]).toBeGreaterThanOrEqual(rates[i + 1]);
    }
  });
});

describe('GET /api/products/search', () => {
  it('filters products matching the query in title/description/category', async () => {
    const electronics = sampleProducts.filter((p) =>
      p.category.toLowerCase().includes('electronics'),
    );
    mockFakeStore.searchProducts.mockResolvedValue(electronics);

    const res = await request(app).get('/api/products/search?q=electronics');

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((p: Product) => {
      expect(p.category.toLowerCase()).toContain('electronics');
    });
  });

  it('returns empty array when no products match', async () => {
    mockFakeStore.searchProducts.mockResolvedValue([]);

    const res = await request(app).get('/api/products/search?q=xyzzy_no_match');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe('GET /api/products/categories', () => {
  it('returns an array of category strings', async () => {
    const categories = ["men's clothing", "women's clothing", 'electronics', 'jewelery'];
    mockFakeStore.getCategories.mockResolvedValue(categories);

    const res = await request(app).get('/api/products/categories');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(categories);
  });
});

describe('GET /api/products/category/:name', () => {
  it('returns products in category sorted by rating.rate desc', async () => {
    const jewelery = sampleProducts
      .filter((p) => p.category === 'jewelery')
      .sort((a, b) => b.rating.rate - a.rating.rate);
    mockFakeStore.getProductsByCategory.mockResolvedValue(jewelery);

    const res = await request(app).get('/api/products/category/jewelery');

    expect(res.status).toBe(200);
    const rates: number[] = res.body.map((p: Product) => p.rating.rate);
    for (let i = 0; i < rates.length - 1; i++) {
      expect(rates[i]).toBeGreaterThanOrEqual(rates[i + 1]);
    }
  });
});

describe('GET /api/products/:id', () => {
  it('returns a single product by ID', async () => {
    mockFakeStore.getProductById.mockResolvedValue(sampleProducts[0]);

    const res = await request(app).get('/api/products/1');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe('Fjallraven Backpack');
  });

  it('returns 404 for unknown product', async () => {
    mockFakeStore.getProductById.mockResolvedValue(null);

    const res = await request(app).get('/api/products/9999');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for non-numeric ID', async () => {
    const res = await request(app).get('/api/products/abc');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
