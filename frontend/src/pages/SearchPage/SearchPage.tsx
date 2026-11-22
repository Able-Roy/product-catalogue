import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '../../api/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import type { Product } from '../../types';
import styles from './SearchPage.module.css';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setError(null);
    searchProducts(q)
      .then(setResults)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Search failed'))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <main className={styles.main}>
      <div className={styles.searchbarWrapper}>
        <SearchBar defaultValue={q} />
      </div>

      <h1 className={styles.heading}>
        {q ? `Search results for "${q}"` : 'Search products'}
      </h1>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && q && results.length === 0 && (
        <p className={styles.noResults}>No products found for &ldquo;{q}&rdquo;</p>
      )}

      {!loading && !error && results.length > 0 && (
        <>
          <p className={styles.count}>{results.length} product{results.length !== 1 ? 's' : ''} found</p>
          <div className={styles.grid}>
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </main>
  );
};

export default SearchPage;
