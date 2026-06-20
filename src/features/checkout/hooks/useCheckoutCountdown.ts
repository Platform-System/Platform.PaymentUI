import { useState, useEffect, useCallback } from 'react';

export function useCheckoutCountdown(
  paymentStatus: 'pending' | 'success' | 'cancelled',
  returnUrl: string,
  cancelUrl: string
) {
  const [countdown, setCountdown] = useState<number>(5);

  const handleRedirect = useCallback(() => {
    const targetUrl = paymentStatus === 'success' ? returnUrl : cancelUrl;
    window.location.href = targetUrl;
  }, [paymentStatus, returnUrl, cancelUrl]);

  useEffect(() => {
    let timer: number;
    if (paymentStatus !== 'pending' && countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleRedirect();
    }
    return () => clearInterval(timer);
  }, [paymentStatus, countdown, handleRedirect]);

  return countdown;
}
