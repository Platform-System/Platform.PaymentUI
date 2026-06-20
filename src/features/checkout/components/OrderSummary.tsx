import React from 'react';

interface OrderSummaryProps {
  platformName: string;
  referenceCode: number;
  paymentLinkId: string;
  amount: number;
  currency: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  platformName,
  referenceCode,
  paymentLinkId,
  amount,
  currency
}) => {
  const formatMoney = (value: number) => {
    return value.toLocaleString('vi-VN') + ' ' + (currency === 'VND' ? 'đ' : currency);
  };

  return (
    <section id="payment-left-sidebar" className="w-full md:w-[40%] bg-secondary/70 border-r border-border/50 text-foreground flex flex-col md:h-full md:overflow-y-auto py-10 md:py-16 px-6 md:px-12 lg:px-16 relative overflow-hidden flex-shrink-0 justify-center">
      {/* Subtle background glow blob */}
      <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] rounded-full bg-muted/30 blur-[100px] pointer-events-none" />
      
      <div className="max-w-sm w-full mx-auto mt-6 md:mt-14 mb-auto relative z-10">
        <div className="space-y-8">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Thông tin giao dịch</span>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-foreground mt-1">Chi tiết hóa đơn</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-border/60 pb-3">
              <span className="text-muted-foreground text-sm">Nhà bán hàng</span>
              <span className="font-semibold text-foreground text-sm">{platformName}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-3">
              <span className="text-muted-foreground text-sm">Mã đơn hàng</span>
              <span className="font-semibold text-foreground text-sm">#{referenceCode}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-3">
              <span className="text-muted-foreground text-sm">Mã liên kết</span>
              <span className="font-mono text-muted-foreground text-xs truncate max-w-[160px]" title={paymentLinkId}>{paymentLinkId || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-3">
              <span className="text-muted-foreground text-sm">Cổng thanh toán</span>
              <span className="font-medium text-foreground text-sm">Mock Sandbox</span>
            </div>
            <div className="pt-2 flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Tổng tiền thanh toán</span>
              <span className="text-3xl font-extrabold text-foreground tracking-tight">{formatMoney(amount)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
