import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <p className={styles.brand}>🛍️ ProductCat</p>
      <p className={styles.copy}>© {new Date().getFullYear()} Product Catalogue. All rights reserved.</p>
      <nav className={styles.links} aria-label="Footer navigation">
        <Link to="/">Home</Link>
        <Link to="/search?q=">Search</Link>
      </nav>
    </div>
  </footer>
);

export default Footer;
