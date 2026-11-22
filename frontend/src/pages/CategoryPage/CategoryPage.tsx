import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory } from '../../api/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import type { Product } from '../../types';
import styles from './CategoryPage.module.css';

const CategoryPage: React.FC = () => {
  const { name = '' } = useParams<{ name: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    setError(null);
    getProductsByCategory(name)
      .then(setProducts)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load products'))
      .finally(() => setLoading(false));
  }, [name]);

  const topRated = products.slice(0, 3);
  const remaining = products.slice(3);

  return (
    <main className={styles.main}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true"> › </span>
        <span className={styles.current}>{decodeURIComponent(name)}</span>
      </nav>

      <h1 className={styles.heading}>{decodeURIComponent(name)}</h1>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <>
          {topRated.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>⭐ Top Rated</h2>
              <div className={styles.grid}>
                {topRated.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}

          {remaining.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>All Products</h2>
              <div className={styles.grid}>
                {remaining.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}

          {products.length === 0 && (
            <p className={styles.empty}>No products found in this category.</p>
          )}
        </>
      )}
    </main>
  );
};

export default CategoryPage;
