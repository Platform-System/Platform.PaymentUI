import React from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { Input } from '@platform-system/design-ui/components/input';

interface PaymentMethodDetailsProps {
  selectedMethod: 'qr' | 'card' | 'wallet';
}

export const PaymentMethodDetails: React.FC<PaymentMethodDetailsProps> = ({ selectedMethod }) => {
  return (
    <div className="bg-secondary/50 border border-border/60 p-5 rounded-2xl">
      {selectedMethod === 'qr' && (
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="bg-card p-3.5 rounded-[22px] shadow-sm border border-border/60 flex items-center justify-center h-40 w-40 relative overflow-hidden group">
            {/* Mock QR Code illustration */}
            <div className="grid grid-cols-5 gap-1.5 w-32 h-32 opacity-85">
              {Array.from({ length: 25 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`rounded-sm ${(i % 3 === 0 || i % 7 === 0 || i < 5 || i % 5 === 0) ? 'bg-foreground' : 'bg-transparent'}`} 
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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
          <div className="h-12 w-12 bg-secondary text-foreground rounded-full flex items-center justify-center mx-auto border border-border">
            <Wallet size={20} className="text-muted-foreground" />
          </div>
          <h5 className="font-semibold text-sm text-foreground">Thanh toán qua Ví điện tử Nyxoris</h5>
          <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
            Sử dụng số dư ví tài khoản để thanh toán giao dịch này một cách an toàn và bảo mật.
          </p>
        </div>
      )}
    </div>
  );
};
