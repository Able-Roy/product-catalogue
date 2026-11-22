import React from 'react';
import styles from './ErrorMessage.module.css';

interface Props {
  message: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => (
  <div className={styles.error} role="alert">
    <strong>Error:</strong> {message}
  </div>
);

export default ErrorMessage;
