import React, { useState } from 'react';
import { submitEnquiry } from '../../api/enquiry';
import type { EnquiryBody } from '../../types';
import styles from './EnquiryModal.module.css';

interface Props {
  productId: number;
  productTitle: string;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const EnquiryModal: React.FC<Props> = ({ productId, productTitle, onClose }) => {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);
    const body: EnquiryBody = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      message: form.message.trim(),
      productId,
      productTitle,
    };
    try {
      await submitEnquiry(body);
      setSubmitted(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="enquiry-modal-title">
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close enquiry modal">✕</button>

        {submitted ? (
          <div className={styles.success}>
            <div className={styles.successIcon} aria-hidden="true">✔</div>
            <h2>Thank you! We'll be in touch.</h2>
            <p>Your enquiry about <strong>{productTitle}</strong> has been received.</p>
            <button className={styles.submitBtn} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2 id="enquiry-modal-title" className={styles.title}>Enquire about this product</h2>
            <p className={styles.productName}>{productTitle}</p>

            {apiError && (
              <div className={styles.apiError} role="alert">{apiError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="enquiry-name">Name <span aria-hidden="true">*</span></label>
                <input
                  id="enquiry-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
                  className={errors.name ? styles.inputError : ''}
                />
                {errors.name && <span id="enquiry-name-error" className={styles.errorText} role="alert">{errors.name}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="enquiry-email">Email <span aria-hidden="true">*</span></label>
                <input
                  id="enquiry-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.email ? 'enquiry-email-error' : undefined}
                  className={errors.email ? styles.inputError : ''}
                />
                {errors.email && <span id="enquiry-email-error" className={styles.errorText} role="alert">{errors.email}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="enquiry-phone">Phone (optional)</label>
                <input
                  id="enquiry-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="enquiry-message">Message <span aria-hidden="true">*</span></label>
                <textarea
                  id="enquiry-message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.message ? 'enquiry-message-error' : undefined}
                  className={errors.message ? styles.inputError : ''}
                />
                {errors.message && <span id="enquiry-message-error" className={styles.errorText} role="alert">{errors.message}</span>}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Enquiry'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
