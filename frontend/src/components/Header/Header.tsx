import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import { useCategories } from '../../hooks/useCategories';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { categories } = useCategories();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Product Catalogue home">
          🛍️ <span>ProductCat</span>
        </Link>

        <div className={styles.searchWrapper}>
          <SearchBar />
        </div>

        <nav className={styles.nav} aria-label="Categories">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat}
              to={`/category/${encodeURIComponent(cat)}`}
              className={styles.navLink}
            >
              {cat}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
