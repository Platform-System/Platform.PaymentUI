import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag,
  User,
  LogOut,
  ChevronRight,
  Store
} from 'lucide-react';
import { useAuth } from '../../../core/auth-context';
import { Button } from '@platform-system/design-ui/components/button';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@platform-system/design-ui/components/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@platform-system/design-ui/components/dropdown-menu';
import { cn } from '@platform-system/design-ui/lib/cn';
import { motion } from 'framer-motion';
import { OrderSelectionScreen } from '../../dashboard';
import { CheckoutProcessingScreen } from './CheckoutProcessingScreen';

export const CheckoutScreen: React.FC = () => {
  const { referenceCode: pathRefCode } = useParams<{ referenceCode: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract payment details from URL
  const referenceCode = Number(pathRefCode || searchParams.get('referenceCode') || '0');
  const paymentLinkId = searchParams.get('paymentLinkId') || '';
  const amount = Number(searchParams.get('amount') || '0');
  const currency = searchParams.get('currency') || 'VND';
  const returnUrl = searchParams.get('returnUrl') || 'http://localhost:3000/account/orders';
  const cancelUrl = searchParams.get('cancelUrl') || 'http://localhost:3000/checkout';

  // Redirect /checkout paths back to / if paymentLinkId is missing
  useEffect(() => {
    if (location.pathname.startsWith('/checkout') && !paymentLinkId) {
      navigate('/', { replace: true });
    }
  }, [paymentLinkId, location.pathname, navigate]);
  
  // Extract platform/merchant name for multi-platform support
  const platformName = searchParams.get('platformName') || searchParams.get('merchantName') || 'Nyxoris';

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      setIsScrolled(target.scrollTop > 20);
    };

    const scrollContainers = [
      document.getElementById('payment-scroll-container'),
      document.getElementById('payment-left-sidebar'),
      document.getElementById('payment-right-content')
    ].filter(Boolean);

    scrollContainers.forEach(container => {
      container?.addEventListener('scroll', handleScroll);
    });

    const checkInitialScroll = () => {
      const hasScroll = scrollContainers.some(c => c && c.scrollTop > 20);
      setIsScrolled(hasScroll);
    };
    checkInitialScroll();

    return () => {
      scrollContainers.forEach(container => {
        container?.removeEventListener('scroll', handleScroll);
      });
    };
  }, [paymentLinkId]);

  const { user, logout } = useAuth();

  const renderHeader = () => {
    const isCheckout = !!paymentLinkId;

    // Helper to get the store base url from returnUrl
    const getStoreBaseUrl = () => {
      try {
        const url = new URL(returnUrl);
        return `${url.protocol}//${url.host}`;
      } catch {
        return 'http://localhost:3000';
      }
    };
    const storeBaseUrl = getStoreBaseUrl();

    return (
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "z-50 transition-all duration-500 flex-shrink-0 sticky top-0 left-0 right-0",
          isScrolled
            ? "border-b border-border bg-background/88 shadow-[0_14px_32px_rgba(17,17,17,0.05)] backdrop-blur-xl"
            : "border-b border-transparent bg-background/80 backdrop-blur-md"
        )}
      >
        <div className="w-full px-4">
          <div className={cn(
            "flex items-center justify-between transition-all duration-500",
            isScrolled ? "h-14" : "h-16"
          )}>
            {/* Logo */}
            <div 
              onClick={() => setSearchParams({})} 
              className="flex items-center group cursor-pointer"
            >
              <span className="font-sans text-xl font-black tracking-tighter text-foreground transition-all duration-300 group-hover:text-muted-foreground">
                Nyxoris
              </span>
            </div>

            <div className="flex items-center gap-4">
              {isCheckout && (
                <button 
                  onClick={() => setSearchParams({})}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 cursor-pointer mr-2 shadow-sm font-medium"
                >
                  Quay lại danh sách đơn hàng
                </button>
              )}

              {/* User profile dropdown like Merchant UI */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-lg" className="relative rounded-full hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shrink-0">
                    <Avatar className="size-9 transition-transform hover:scale-110 active:scale-95 shrink-0" showDropdownIndicator>
                      <AvatarImage src="" alt="User" className="object-cover shrink-0" />
                      <AvatarFallback className="shrink-0 bg-secondary text-muted-foreground border border-border">
                        <User className="size-5 shrink-0" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-popover border border-border text-popover-foreground shadow-lg" align="end" alignOffset={5} forceMount>
                  <DropdownMenuItem asChild className="cursor-pointer font-normal p-2.5 min-w-0 focus:bg-accent focus:text-accent-foreground">
                    <a href={`${storeBaseUrl}/profile`} className="flex items-center gap-3 w-full min-w-0">
                      <Avatar className="size-10 shrink-0 ring-2 ring-border ring-offset-1 ring-offset-background">
                        <AvatarFallback className="bg-secondary text-muted-foreground">
                          <User className="size-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-foreground truncate" title={user?.name || user?.preferred_username || 'Người dùng'}>
                          {user?.name || user?.preferred_username || 'Người dùng'}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          {user?.email || 'N/A'}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/60 shrink-0 ml-auto" />
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem asChild className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                    <a href={storeBaseUrl}>
                      <Store className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Cửa hàng Nyxoris</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                    <a href={`${storeBaseUrl}/space?tab=orders`}>
                      <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Đơn hàng của tôi</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.header>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground font-sans relative flex flex-col select-none">
      {renderHeader()}

      {!paymentLinkId ? (
        <OrderSelectionScreen />
      ) : (
        <CheckoutProcessingScreen
          paymentLinkId={paymentLinkId}
          referenceCode={referenceCode}
          amount={amount}
          currency={currency}
          platformName={platformName}
          returnUrl={returnUrl}
          cancelUrl={cancelUrl}
        />
      )}
    </div>
  );
};
