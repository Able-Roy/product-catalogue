import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
}

function renderStars(rate: number): React.ReactNode {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= Math.round(rate) ? styles.starFilled : styles.starEmpty} aria-hidden="true">
        ★
      </span>
    );
  }
  return stars;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/product/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/product/${product.id}`); }}
      aria-label={`View ${product.title}`}
    >
      <div className={styles.imageWrapper}>
        <img src={product.image} alt={product.title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.rating} aria-label={`Rating: ${product.rating.rate} out of 5`}>
          {renderStars(product.rating.rate)}
          <span className={styles.ratingCount}>({product.rating.count})</span>
        </div>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
      </div>
    </article>
  );
};

export default ProductCard;
