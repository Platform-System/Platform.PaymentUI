import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@platform-system/design-ui/components/button';
import { Separator } from '@platform-system/design-ui/components/separator';
import { useCompleteCheckout } from '../hooks/useCheckout';
import { useCheckoutCountdown } from '../hooks/useCheckoutCountdown';
import { OrderSummary } from '../components/OrderSummary';
import { PaymentMethodsSelector } from '../components/PaymentMethodsSelector';
import { PaymentMethodDetails } from '../components/PaymentMethodDetails';

interface CheckoutProcessingScreenProps {
  paymentLinkId: string;
  referenceCode: number;
  amount: number;
  currency: string;
  platformName: string;
  returnUrl: string;
  cancelUrl: string;
}

export const CheckoutProcessingScreen: React.FC<CheckoutProcessingScreenProps> = ({
  paymentLinkId,
  referenceCode,
  amount,
  currency,
  platformName,
  returnUrl,
  cancelUrl
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'qr' | 'card' | 'wallet'>('qr');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'cancelled'>('pending');

  const completeCheckoutMutation = useCompleteCheckout();
  const countdown = useCheckoutCountdown(paymentStatus, returnUrl, cancelUrl);

  const handleRedirect = () => {
    const targetUrl = paymentStatus === 'success' ? returnUrl : cancelUrl;
    window.location.href = targetUrl;
  };

  const handleProcessPayment = async (statusResult: 'success' | 'cancel') => {
    if (!referenceCode || !paymentLinkId) {
      alert("Thiếu mã tham chiếu (referenceCode) hoặc ID liên kết thanh toán (paymentLinkId)!");
      return;
    }

    try {
      await completeCheckoutMutation.mutateAsync({
        referenceCode,
        paymentLinkId,
        result: statusResult
      });

      if (statusResult === 'success') {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('cancelled');
      }
    } catch (error) {
      console.error("Lỗi hoàn thành thanh toán:", error);
      alert("Đã có lỗi xảy ra khi cập nhật trạng thái giao dịch!");
    }
  };

  const formatMoney = (value: number) => {
    return value.toLocaleString('vi-VN') + ' ' + (currency === 'VND' ? 'đ' : currency);
  };

  // Success State Screen (Centered modal layout)
  if (paymentStatus === 'success') {
    return (
      <div className="h-screen overflow-y-auto flex items-center justify-center p-6 bg-[var(--background)] relative font-sans">
        {/* Background glow & grid */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
          <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px]" 
            style={{ maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)' }}
          />
        </div>

        <div className="ds-glass-card max-w-md w-full p-8 text-center rounded-[30px] border border-border/40 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative z-10 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <CheckCircle2 size={36} className="stroke-[1.5]" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-semibold tracking-[-0.02em] text-foreground mb-1">Thanh toán thành công!</h1>
          <p className="text-muted-foreground text-xs mb-6">Đơn hàng đã được thanh toán thông qua cổng kiểm thử Sandbox.</p>
          
          <div className="ds-glass-panel p-5 rounded-2xl border border-border/30 text-left mb-6 space-y-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Nhà bán hàng:</span>
              <span className="font-semibold text-foreground">{platformName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Mã tham chiếu:</span>
              <span className="font-semibold text-foreground">#{referenceCode}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Mã giao dịch:</span>
              <span className="font-mono text-foreground text-[10px] truncate max-w-[180px]" title={paymentLinkId}>{paymentLinkId}</span>
            </div>
            <Separator className="bg-border/30" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Phương thức:</span>
              <span className="font-medium text-foreground capitalize">Nyxoris ({selectedMethod})</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Số tiền:</span>
              <span className="font-bold text-foreground text-sm">{formatMoney(amount)}</span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground mb-6">
            Tự động chuyển hướng về trang chủ trong <span className="font-bold text-foreground text-sm">{countdown}</span> giây...
          </p>

          <Button className="w-full" size="lg" onClick={handleRedirect}>
            Quay lại cửa hàng ngay
          </Button>
        </div>
      </div>
    );
  }

  // Cancelled State Screen (Centered modal layout)
  if (paymentStatus === 'cancelled') {
    return (
      <div className="h-screen overflow-y-auto flex items-center justify-center p-6 bg-[var(--background)] relative font-sans">
        {/* Background glow & grid */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
          <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-rose-500/10 blur-[120px]" />
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px]" 
            style={{ maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)' }}
          />
        </div>

        <div className="ds-glass-card max-w-md w-full p-8 text-center rounded-[30px] border border-border/40 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative z-10 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center border border-rose-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
              <XCircle size={36} className="stroke-[1.5]" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-semibold tracking-[-0.02em] text-foreground mb-1">Đã hủy thanh toán</h1>
          <p className="text-muted-foreground text-xs mb-6">Yêu cầu thanh toán của bạn đã bị hủy bỏ hoặc không thể hoàn thành.</p>
          
          <div className="ds-glass-panel p-5 rounded-2xl border border-border/30 text-left mb-6 space-y-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Nhà bán hàng:</span>
              <span className="font-semibold text-foreground">{platformName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Mã tham chiếu:</span>
              <span className="font-semibold text-foreground">#{referenceCode}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Mã giao dịch:</span>
              <span className="font-mono text-foreground text-[10px] truncate max-w-[180px]" title={paymentLinkId}>{paymentLinkId}</span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground mb-6">
            Tự động chuyển hướng về trang giỏ hàng trong <span className="font-bold text-foreground text-sm">{countdown}</span> giây...
          </p>

          <Button variant="outline" className="w-full" size="lg" onClick={handleRedirect}>
            Quay lại trang thanh toán
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col md:flex-row min-h-0 overflow-y-auto md:overflow-hidden relative z-10">
      <OrderSummary
        platformName={platformName}
        referenceCode={referenceCode}
        paymentLinkId={paymentLinkId}
        amount={amount}
        currency={currency}
      />

      {/* Right Section - Payment Methods & Simulation */}
      <section id="payment-right-content" className="flex-1 flex flex-col md:h-full md:overflow-y-auto py-10 md:py-16 px-6 md:px-12 lg:px-16 justify-center bg-background relative">


        <div className="max-w-md w-full mx-auto mt-6 md:mt-14 mb-auto min-h-[540px] flex flex-col justify-between relative z-10">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Phương thức thanh toán</h3>
              <p className="text-muted-foreground text-xs mt-1">Chọn phương thức bạn muốn giả lập để kiểm thử</p>
            </div>

            <PaymentMethodsSelector
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
            />

            <PaymentMethodDetails
              selectedMethod={selectedMethod}
            />
          </div>

          {/* Action Simulation Buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              className="w-full"
              size="lg"
              onClick={() => handleProcessPayment('success')}
              loading={completeCheckoutMutation.isPending}
            >
              Xác nhận thanh toán
            </Button>

            <Button 
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => handleProcessPayment('cancel')}
              disabled={completeCheckoutMutation.isPending}
            >
              Hủy bỏ giao dịch
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};
