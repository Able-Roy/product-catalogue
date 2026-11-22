import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import SearchPage from './pages/SearchPage/SearchPage';
import ProductPage from './pages/ProductPage/ProductPage';
import styles from './App.module.css';

const App: React.FC = () => (
  <div className={styles.appShell}>
    <Header />
    <div className={styles.content}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </div>
    <Footer />
  </div>
);

export default App;
