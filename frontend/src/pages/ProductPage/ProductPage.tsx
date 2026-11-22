import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import EnquiryModal from '../../components/EnquiryModal/EnquiryModal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './ProductPage.module.css';

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

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { product, loading, error } = useProduct(productId);
  const [showModal, setShowModal] = useState(false);

  return (
    <main className={styles.main}>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && product && (
        <>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true"> › </span>
            <Link to={`/category/${encodeURIComponent(product.category)}`}>{product.category}</Link>
            <span aria-hidden="true"> › </span>
            <span className={styles.current}>{product.title}</span>
          </nav>

          <div className={styles.productLayout}>
            <div className={styles.imageSection}>
              <img src={product.image} alt={product.title} className={styles.image} />
            </div>

            <div className={styles.details}>
              <span className={styles.categoryBadge}>{product.category}</span>
              <h1 className={styles.title}>{product.title}</h1>

              <div className={styles.ratingRow} aria-label={`Rating: ${product.rating.rate} out of 5`}>
                <div className={styles.stars}>{renderStars(product.rating.rate)}</div>
                <span className={styles.ratingText}>{product.rating.rate} / 5 ({product.rating.count} reviews)</span>
              </div>

              <p className={styles.price}>${product.price.toFixed(2)}</p>

              <p className={styles.description}>{product.description}</p>

              <button className={styles.enquireBtn} onClick={() => setShowModal(true)}>
                Enquire Now
              </button>
            </div>
          </div>

          {showModal && (
            <EnquiryModal
              productId={product.id}
              productTitle={product.title}
              onClose={() => setShowModal(false)}
            />
          )}
        </>
      )}
    </main>
  );
};

export default ProductPage;
