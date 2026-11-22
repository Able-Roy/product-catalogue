import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock API calls
vi.mock('../src/api/products', () => ({
  getFeaturedProducts: vi.fn(),
  getCategories: vi.fn(),
}));

import { getFeaturedProducts, getCategories } from '../src/api/products';
import HomePage from '../src/pages/HomePage/HomePage';
import type { Product } from '../src/types';

const mockGetFeatured = getFeaturedProducts as ReturnType<typeof vi.fn>;
const mockGetCategories = getCategories as ReturnType<typeof vi.fn>;

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Product One',
    price: 29.99,
    description: 'Description one',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/1.jpg',
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: 'Product Two',
    price: 59.99,
    description: 'Description two',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/2.jpg',
    rating: { rate: 3.8, count: 50 },
  },
];

const mockCategories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];

describe('HomePage', () => {
  beforeEach(() => {
    mockGetFeatured.mockResolvedValue(mockProducts);
    mockGetCategories.mockResolvedValue(mockCategories);
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

  it('renders hero section', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /discover amazing products/i })).toBeInTheDocument();
  });

  it('renders "Top Rated Products" section heading', () => {
    renderPage();
    expect(screen.getByText(/top rated products/i)).toBeInTheDocument();
  });

  it('renders featured products after loading', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Product One')).toBeInTheDocument();
      expect(screen.getByText('Product Two')).toBeInTheDocument();
    });
  });

  it('renders category links after loading', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'electronics' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'jewelery' })).toBeInTheDocument();
    });
  });

  it('category links point to correct routes', async () => {
    renderPage();
    await waitFor(() => {
      const electronicsLink = screen.getByRole('link', { name: 'electronics' });
      expect(electronicsLink).toHaveAttribute('href', '/category/electronics');
    });
  });
});
