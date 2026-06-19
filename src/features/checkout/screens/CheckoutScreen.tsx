import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useCompleteCheckout } from '../hooks/useCheckout';
import { 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  Wallet, 
  QrCode, 
  ShieldCheck
} from 'lucide-react';
import { Button } from '@platform-system/design-ui/components/button';
import { Input } from '@platform-system/design-ui/components/input';

export const CheckoutScreen: React.FC = () => {
  const { referenceCode: pathRefCode } = useParams<{ referenceCode: string }>();
  const [searchParams] = useSearchParams();

  // Extract payment details from URL
  const referenceCode = Number(pathRefCode || searchParams.get('referenceCode') || '0');
  const paymentLinkId = searchParams.get('paymentLinkId') || '';
  const amount = Number(searchParams.get('amount') || '0');
  const currency = searchParams.get('currency') || 'VND';
  const returnUrl = searchParams.get('returnUrl') || 'http://localhost:3000/account/orders';
  const cancelUrl = searchParams.get('cancelUrl') || 'http://localhost:3000/checkout';
  
  // Extract platform/merchant name for multi-platform support
  const platformName = searchParams.get('platformName') || searchParams.get('merchantName') || 'Nyxoris';

  const [selectedMethod, setSelectedMethod] = useState<'qr' | 'card' | 'wallet'>('qr');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'cancelled'>('pending');
  const [countdown, setCountdown] = useState<number>(5);

  const completeCheckoutMutation = useCompleteCheckout();

  const handleRedirect = useCallback(() => {
    const targetUrl = paymentStatus === 'success' ? returnUrl : cancelUrl;
    window.location.href = targetUrl;
  }, [paymentStatus, returnUrl, cancelUrl]);

  // Handle countdown and auto-redirect after payment completion
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] relative overflow-hidden font-sans">
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
            <div className="h-px bg-border/30 border-dashed" />
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] relative overflow-hidden font-sans">
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

  // Active Checkout Screen (Split layout full height with premium dark-light contrast)
  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-[var(--background)] text-foreground flex flex-col relative font-sans select-none">
      
      {/* Floating Adaptive Header */}
      <header className="absolute top-0 left-0 w-full z-50 h-20 bg-neutral-950 md:bg-transparent border-b border-neutral-900 md:border-none flex items-center justify-between px-6 md:px-12 lg:px-16 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-white text-neutral-950 p-2 rounded-xl flex items-center justify-center shadow-sm">
            <ShieldCheck size={20} className="stroke-[1.5]" />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight text-white">
            Nyxoris
          </span>
        </div>
      </header>

      {/* Main Body - Split Layout */}
      <main className="flex-1 flex flex-col md:flex-row min-h-0 relative z-10">
        
        {/* Left Section - Order Info (Deep Premium Dark Side, Centered Vertically & Horizontally with fixed min-h) */}
        <section className="w-full md:w-[40%] bg-neutral-950 text-white flex flex-col md:h-full md:overflow-y-auto pt-24 md:pt-32 px-6 md:px-12 lg:px-16 pb-16 md:pb-48 relative overflow-hidden flex-shrink-0 justify-center">
          {/* Subtle background glow blob */}
          <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] rounded-full bg-neutral-800/20 blur-[100px] pointer-events-none" />
          
          <div className="max-w-sm w-full mx-auto mt-6 md:mt-14 mb-auto relative z-10">
            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Thông tin giao dịch</span>
                <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-white mt-1">Chi tiết hóa đơn</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between border-b border-neutral-800 pb-3">
                  <span className="text-neutral-400 text-sm">Nhà bán hàng</span>
                  <span className="font-semibold text-white text-sm">{platformName}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800 pb-3">
                  <span className="text-neutral-400 text-sm">Mã đơn hàng</span>
                  <span className="font-semibold text-white text-sm">#{referenceCode}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800 pb-3">
                  <span className="text-neutral-400 text-sm">Mã liên kết</span>
                  <span className="font-mono text-neutral-300 text-xs truncate max-w-[160px]" title={paymentLinkId}>{paymentLinkId || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800 pb-3">
                  <span className="text-neutral-400 text-sm">Cổng thanh toán</span>
                  <span className="font-medium text-white text-sm">Mock Sandbox</span>
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-300">Tổng tiền thanh toán</span>
                  <span className="text-3xl font-extrabold text-white tracking-tight">{formatMoney(amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section - Payment Methods & Simulation (Clean White Light Side, Centered Vertically & Horizontally with matching min-h) */}
        <section className="flex-1 flex flex-col md:h-full md:overflow-y-auto pt-8 md:pt-32 px-6 md:px-12 lg:px-16 pb-16 md:pb-48 justify-center bg-white relative">
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
            <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-neutral-100 blur-[100px]" />
            <div 
              className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px]" 
              style={{ maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)' }}
            />
          </div>

          <div className="max-w-md w-full mx-auto mt-6 md:mt-14 mb-auto min-h-[540px] flex flex-col justify-between relative z-10">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-foreground">Phương thức thanh toán</h3>
                <p className="text-muted-foreground text-xs mt-1">Chọn phương thức bạn muốn giả lập để kiểm thử</p>
              </div>

              {/* Payment Method Selector Grid */}
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setSelectedMethod('qr')}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border text-center transition-all duration-300 ${
                    selectedMethod === 'qr' 
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-[0_8px_20px_rgba(0,0,0,0.15)] scale-[1.02] font-semibold' 
                      : 'border-border/60 hover:border-border text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                  }`}
                >
                  <QrCode size={20} className={selectedMethod === 'qr' ? 'text-white' : 'text-muted-foreground'} />
                  <span className="text-xs font-medium">Mã QR</span>
                </button>

                <button 
                  onClick={() => setSelectedMethod('card')}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border text-center transition-all duration-300 ${
                    selectedMethod === 'card' 
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-[0_8px_20px_rgba(0,0,0,0.15)] scale-[1.02] font-semibold' 
                      : 'border-border/60 hover:border-border text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                  }`}
                >
                  <CreditCard size={20} className={selectedMethod === 'card' ? 'text-white' : 'text-muted-foreground'} />
                  <span className="text-xs font-medium">Thẻ tín dụng</span>
                </button>

                <button 
                  onClick={() => setSelectedMethod('wallet')}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border text-center transition-all duration-300 ${
                    selectedMethod === 'wallet' 
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-[0_8px_20px_rgba(0,0,0,0.15)] scale-[1.02] font-semibold' 
                      : 'border-border/60 hover:border-border text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                  }`}
                >
                  <Wallet size={20} className={selectedMethod === 'wallet' ? 'text-white' : 'text-muted-foreground'} />
                  <span className="text-xs font-medium">Ví điện tử</span>
                </button>
              </div>

              {/* Payment Method Details Simulation */}
              <div className="bg-muted/15 border border-border/40 p-5 rounded-2xl">
                {selectedMethod === 'qr' && (
                  <div className="flex flex-col items-center justify-center py-4 space-y-4">
                    <div className="bg-white p-3.5 rounded-[22px] shadow-sm border border-neutral-100 flex items-center justify-center h-40 w-40 relative overflow-hidden group">
                      {/* Mock QR Code illustration */}
                      <div className="grid grid-cols-5 gap-1.5 w-32 h-32 opacity-85">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`rounded-sm ${(i % 3 === 0 || i % 7 === 0 || i < 5 || i % 5 === 0) ? 'bg-neutral-800' : 'bg-transparent'}`} 
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center max-w-[280px] leading-relaxed">
                      Mở ứng dụng Ngân hàng hoặc Ví điện tử quét mã QR phía trên để bắt đầu giao dịch kiểm thử.
                    </p>
                  </div>
                )}

                {selectedMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Số thẻ</label>
                      <Input 
                        disabled 
                        value="4242 4242 4242 4242" 
                        endAdornment={<CreditCard size={16} className="text-muted-foreground" />} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">Ngày hết hạn</label>
                        <Input disabled value="12/29" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">CVC</label>
                        <Input disabled value="123" />
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Thông tin thẻ visa thử nghiệm đã được điền sẵn mặc định. Bạn chỉ cần bấm Xác nhận thanh toán phía dưới.
                    </p>
                  </div>
                )}

                {selectedMethod === 'wallet' && (
                  <div className="text-center py-6 space-y-3">
                    <div className="h-12 w-12 bg-muted text-foreground rounded-full flex items-center justify-center mx-auto border border-border/40">
                      <Wallet size={20} />
                    </div>
                    <h5 className="font-semibold text-sm text-foreground">Thanh toán qua Ví điện tử Nyxoris</h5>
                    <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                      Sử dụng số dư ví tài khoản để thanh toán giao dịch này một cách an toàn và bảo mật.
                    </p>
                  </div>
                )}
              </div>
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
    </div>
  );
};
