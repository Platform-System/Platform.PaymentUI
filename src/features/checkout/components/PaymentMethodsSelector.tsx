import React from 'react';
import { QrCode, CreditCard, Wallet } from 'lucide-react';

interface PaymentMethodsSelectorProps {
  selectedMethod: 'qr' | 'card' | 'wallet';
  setSelectedMethod: (method: 'qr' | 'card' | 'wallet') => void;
}

export const PaymentMethodsSelector: React.FC<PaymentMethodsSelectorProps> = ({
  selectedMethod,
  setSelectedMethod
}) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <button 
        onClick={() => setSelectedMethod('qr')}
        className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border text-center transition-all duration-300 ${
          selectedMethod === 'qr' 
            ? 'bg-foreground text-background border-foreground shadow-md scale-[1.02] font-semibold' 
            : 'border-border/60 hover:border-border text-muted-foreground hover:bg-muted/30 hover:text-foreground'
        }`}
      >
        <QrCode size={20} className={selectedMethod === 'qr' ? 'text-background' : 'text-muted-foreground'} />
        <span className="text-xs font-medium">Mã QR</span>
      </button>

      <button 
        onClick={() => setSelectedMethod('card')}
        className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border text-center transition-all duration-300 ${
          selectedMethod === 'card' 
            ? 'bg-foreground text-background border-foreground shadow-md scale-[1.02] font-semibold' 
            : 'border-border/60 hover:border-border text-muted-foreground hover:bg-muted/30 hover:text-foreground'
        }`}
      >
        <CreditCard size={20} className={selectedMethod === 'card' ? 'text-background' : 'text-muted-foreground'} />
        <span className="text-xs font-medium">Thẻ tín dụng</span>
      </button>

      <button 
        onClick={() => setSelectedMethod('wallet')}
        className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border text-center transition-all duration-300 ${
          selectedMethod === 'wallet' 
            ? 'bg-foreground text-background border-foreground shadow-md scale-[1.02] font-semibold' 
            : 'border-border/60 hover:border-border text-muted-foreground hover:bg-muted/30 hover:text-foreground'
        }`}
      >
        <Wallet size={20} className={selectedMethod === 'wallet' ? 'text-background' : 'text-muted-foreground'} />
        <span className="text-xs font-medium">Ví điện tử</span>
      </button>
    </div>
  );
};
