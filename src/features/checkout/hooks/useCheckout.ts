import { useMutation } from '@tanstack/react-query';
import { completeSandboxPayment } from '../api/checkoutApi';

export function useCompleteCheckout() {
  return useMutation({
    mutationFn: ({
      referenceCode,
      paymentLinkId,
      result
    }: {
      referenceCode: number;
      paymentLinkId: string;
      result: 'success' | 'cancel';
    }) => completeSandboxPayment(referenceCode, paymentLinkId, result)
  });
}
