import { apiClient } from '../../../shared/api/apiClient';

export interface CompletePaymentResponse {
  message: string;
  referenceCode: number;
  paymentLinkId: string;
}

export async function completeSandboxPayment(
  referenceCode: number,
  paymentLinkId: string,
  result: 'success' | 'cancel'
): Promise<CompletePaymentResponse> {
  // Call the HTTP GET endpoint on the backend
  const response = await apiClient.get<CompletePaymentResponse>(
    `/api/payments/sandbox/complete/${referenceCode}`,
    {
      params: {
        paymentLinkId,
        result
      }
    }
  );
  return response.data;
}
