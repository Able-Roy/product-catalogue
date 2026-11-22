import app from './app';
import config from './config';
import { initEmailTransporter } from './services/emailService';

async function main(): Promise<void> {
  // Initialise email transporter before accepting requests
  await initEmailTransporter();

  app.listen(config.port, () => {
    console.log(`[server] Running on http://localhost:${config.port}`);
  });
}

main().catch((err) => {
  console.error('[server] Fatal startup error:', err);
  process.exit(1);
});
