import nodemailer, { Transporter } from 'nodemailer';
import config from '../config';
import { EnquiryPayload } from '../types';

let transporter: Transporter | null = null;

/**
 * Initialises the Nodemailer transporter.
 * Uses configured SMTP if SMTP_HOST is set, otherwise creates an Ethereal
 * test account and logs the credentials to stdout.
 */
export async function initEmailTransporter(): Promise<void> {
  if (config.smtp.host) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
    console.log(`[email] Using SMTP server: ${config.smtp.host}:${config.smtp.port}`);
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('[email] Using Ethereal test account:', testAccount.user);
  }
}

/**
 * Sends a product enquiry email to the sales inbox.
 * @param payload - The enquiry form data
 */
export async function sendEnquiryEmail(payload: EnquiryPayload): Promise<void> {
  if (!transporter) {
    await initEmailTransporter();
  }

  const fromAddress = config.smtp.from || '"Product Catalogue" <noreply@productcatalogue.com>';

  const html = `
    <h2>Product Enquiry</h2>
    <p><strong>Product:</strong> ${payload.productTitle} (ID: ${payload.productId})</p>
    <hr />
    <p><strong>Name:</strong> ${payload.name}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    ${payload.phone ? `<p><strong>Phone:</strong> ${payload.phone}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${payload.message}</p>
  `;

  const info = await transporter!.sendMail({
    from: fromAddress,
    to: config.salesEmail,
    replyTo: payload.email,
    subject: `Product Enquiry: ${payload.productTitle}`,
    html,
    text: `Product Enquiry\n\nProduct: ${payload.productTitle} (ID: ${payload.productId})\n\nName: ${payload.name}\nEmail: ${payload.email}\n${payload.phone ? `Phone: ${payload.phone}\n` : ''}Message:\n${payload.message}`,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log('[email] Preview URL:', previewUrl);
  }
}
