import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../src/components/ProductCard/ProductCard';
import type { Product } from '../src/types';

const mockProduct: Product = {
  id: 1,
  title: 'Fjallraven - Foldsack No. 1 Backpack',
  price: 109.95,
  description: 'Your perfect pack for everyday use.',
  category: 'men\'s clothing',
  image: 'https://fakestoreapi.com/img/81fAn6rA72L._AC_UX679_.jpg',
  rating: { rate: 3.9, count: 120 },
};

const renderCard = () =>
  render(
    <MemoryRouter>
      <ProductCard product={mockProduct} />
    </MemoryRouter>
  );

describe('ProductCard', () => {
  it('renders product title', () => {
    renderCard();
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });

  it('renders formatted price', () => {
    renderCard();
    expect(screen.getByText('$109.95')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    renderCard();
    expect(screen.getByText("men's clothing")).toBeInTheDocument();
  });

  it('renders rating count', () => {
    renderCard();
    expect(screen.getByText('(120)')).toBeInTheDocument();
  });

  it('renders product image with alt text', () => {
    renderCard();
    const img = screen.getByAltText(mockProduct.title);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockProduct.image);
  });

  it('card has accessible role and label', () => {
    renderCard();
    expect(screen.getByRole('button', { name: /View Fjallraven/i })).toBeInTheDocument();
  });
});
