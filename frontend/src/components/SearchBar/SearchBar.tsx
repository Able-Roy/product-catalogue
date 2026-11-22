import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.css';

interface Props {
  defaultValue?: string;
}

const SearchBar: React.FC<Props> = ({ defaultValue = '' }) => {
  const [term, setTerm] = useState(defaultValue);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = term.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <label htmlFor="search-input" className={styles.srOnly}>
        Search products
      </label>
      <input
        id="search-input"
        type="search"
        className={styles.input}
        placeholder="Search products…"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        aria-label="Search products"
      />
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
