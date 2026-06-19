import { apiClient } from '../../../shared/api/apiClient';

export interface PaymentTransaction {
  paymentId: string;
  referenceType: string;
  referenceId: string;
  referenceCode: number;
  provider: string;
  paymentLinkId?: string;
  checkoutUrl?: string;
  amount: number;
  currency?: string;
  paidAt?: string;
  status: string;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export async function getCurrentUserTransactions(page = 1, pageSize = 10): Promise<PagedResult<PaymentTransaction>> {
  const response = await apiClient.get<PagedResult<PaymentTransaction>>('/api/payments/me/transactions', {
    params: { page, pageSize }
  });
  return response.data;
}
