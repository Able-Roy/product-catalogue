import dotenv from 'dotenv';

dotenv.config();

/** Application configuration derived from environment variables. */
const config = {
  port: parseInt(process.env.PORT ?? '4000', 10),
  fakeStoreBaseUrl: process.env.FAKE_STORE_BASE_URL ?? 'https://fakestoreapi.com',
  salesEmail: process.env.SALES_EMAIL ?? 'sales@example.com',
  smtp: {
    host: process.env.SMTP_HOST ?? '',
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    from: process.env.SMTP_FROM ?? '',
  },
  /** Cache TTL in milliseconds (5 minutes). */
  cacheTtlMs: 5 * 60 * 1000,
} as const;

export default config;
