import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getCategories } from '../../api/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import type { Product } from '../../types';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState<string | null>(null);
  const [errorCats, setErrorCats] = useState<string | null>(null);

  useEffect(() => {
    getFeaturedProducts()
      .then(setFeatured)
      .catch((err: unknown) => setErrorFeatured(err instanceof Error ? err.message : 'Failed to load featured products'))
      .finally(() => setLoadingFeatured(false));
  }, []);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err: unknown) => setErrorCats(err instanceof Error ? err.message : 'Failed to load categories'))
      .finally(() => setLoadingCats(false));
  }, []);

  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Discover Amazing Products</h1>
        <p className={styles.heroTagline}>Shop the best deals across all categories, curated just for you.</p>
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Top Rated Products</h2>
        {loadingFeatured && <LoadingSpinner />}
        {errorFeatured && <ErrorMessage message={errorFeatured} />}
        {!loadingFeatured && !errorFeatured && (
          <div className={styles.grid}>
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Browse by Category</h2>
        {loadingCats && <LoadingSpinner />}
        {errorCats && <ErrorMessage message={errorCats} />}
        {!loadingCats && !errorCats && (
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${encodeURIComponent(cat)}`}
                className={styles.categoryCard}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
