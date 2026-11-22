import { Router, Request, Response, NextFunction } from 'express';
import {
  getAllProducts,
  getFeaturedProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
  getProductById,
} from '../services/fakeStoreService';

const router = Router();

/** GET /api/products — all products */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

/** GET /api/products/featured — top 5 by rating.rate */
router.get('/featured', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getFeaturedProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

/** GET /api/products/search?q= — full-text filter */
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string) ?? '';
    const products = await searchProducts(q);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

/** GET /api/products/categories — unique category list */
router.get('/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

/** GET /api/products/category/:name — products in category */
router.get('/category/:name', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getProductsByCategory(req.params.name);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

/** GET /api/products/:id — single product by ID */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }
    const product = await getProductById(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

export default router;
