import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import productsRouter from './routes/products';
import enquiryRouter from './routes/enquiry';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/products', productsRouter);
app.use('/api/enquiry', enquiryRouter);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
