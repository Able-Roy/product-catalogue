import apiClient from './client';
import type { EnquiryBody } from '../types';

/** Submit a product enquiry */
export async function submitEnquiry(body: EnquiryBody): Promise<void> {
  await apiClient.post('/enquiry', body);
}
