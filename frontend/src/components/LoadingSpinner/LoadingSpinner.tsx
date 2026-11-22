import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner: React.FC = () => (
  <div className={styles.wrapper} role="status" aria-label="Loading">
    <div className={styles.spinner} />
    <span className={styles.srOnly}>Loading…</span>
  </div>
);

export default LoadingSpinner;
