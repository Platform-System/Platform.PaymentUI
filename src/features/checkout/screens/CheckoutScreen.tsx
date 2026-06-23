import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingBag,
  User,
  LogOut,
  Store,
  Globe,
  Shield
} from 'lucide-react';
import { useAuth } from '../../../core/auth-context';
import { Avatar, AvatarFallback, AvatarImage, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, UserProfileCard, HeaderLayout, UserProfileDropdown } from '@platform-system/design-ui';
import { OrderSelectionScreen } from '../../dashboard';
import { CheckoutProcessingScreen } from './CheckoutProcessingScreen';
import { apiClient } from '../../../shared/api/apiClient';

interface Result<T> {
  success: boolean;
  data?: T;
  statusCode?: number;
  message?: string;
}

const portals = [
  { id: 'customer', name: 'Cổng khách hàng', url: 'https://nyxoris.com', icon: <Globe size={16} />, active: true },
  { id: 'merchant', name: 'Cổng người bán', url: 'https://merchant.nyxoris.com', icon: <ShoppingBag size={16} />, active: true },
  { id: 'admin', name: 'Cổng quản trị', url: 'https://admin.nyxoris.com', icon: <Shield size={16} />, active: true },
];

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
      const scrollTop = target.scrollTop;
      setIsScrolled((prev) => {
        if (prev) {
          return scrollTop > 15;
        }
        return scrollTop > 35;
      });
    };

    const scrollContainers = [
      document.getElementById('payment-scroll-container'),
      document.getElementById('payment-left-sidebar'),
      document.getElementById('payment-right-content')
    ].filter(Boolean);

    scrollContainers.forEach(container => {
      container?.addEventListener('scroll', handleScroll, { passive: true });
    });

    const checkInitialScroll = () => {
      const hasScroll = scrollContainers.some(c => c && c.scrollTop > 35);
      setIsScrolled(hasScroll);
    };
    checkInitialScroll();

    return () => {
      scrollContainers.forEach(container => {
        container?.removeEventListener('scroll', handleScroll);
      });
    };
  }, [paymentLinkId]);

  const { user, logout, isAuthenticated } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<Result<{ identityId?: string | null, userName?: string | null, email?: string | null, avatarUrl?: string | null, displayName?: string | null }>>("/api/identity/users/me")
        if (response.data && response.data.success && response.data.data) {
          const p = response.data.data
          try {
            const [avatarResponse, profileResponse] = await Promise.allSettled([
              apiClient.get<Result<{ url?: string | null }>>("/api/identity/users/me/images/avatar"),
              apiClient.get<Result<{ displayName?: string | null }>>("/api/identity/users/me/profile")
            ])
            if (avatarResponse.status === "fulfilled" && avatarResponse.value.data && avatarResponse.value.data.success && avatarResponse.value.data.data?.url) {
              p.avatarUrl = avatarResponse.value.data.data.url
            }
            if (profileResponse.status === "fulfilled" && profileResponse.value.data && profileResponse.value.data.success && profileResponse.value.data.data?.displayName) {
              p.displayName = profileResponse.value.data.data.displayName
            }
          } catch {
            // Ignored
          }
          if (typeof window !== "undefined" && p.identityId) {
            if (p.avatarUrl && p.avatarUrl.includes("/local-avatar-fallback/")) {
              const localAvatar = localStorage.getItem("user_avatar_" + p.identityId)
              if (localAvatar) {
                p.avatarUrl = localAvatar
              } else {
                p.avatarUrl = ""
              }
            } else if (!p.avatarUrl) {
              const localAvatar = localStorage.getItem("user_avatar_" + p.identityId)
              if (localAvatar) {
                p.avatarUrl = localAvatar
              }
            }
          }
          return p
        }
      } catch {
        return null
      }
      return null
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });

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
      <HeaderLayout
        isScrolled={isScrolled}
        logo={
          <div 
            onClick={() => setSearchParams({})} 
            className="flex items-center group cursor-pointer"
          >
            <span className="font-sans text-xl font-black tracking-tighter text-foreground transition-all duration-300 group-hover:text-muted-foreground">
              Nyxoris
            </span>
          </div>
        }
        rightActions={
          <>
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
                    <AvatarImage src={profile?.avatarUrl || user?.picture || user?.avatar || ""} alt="User" className="object-cover shrink-0" />
                    <AvatarFallback className="shrink-0 bg-secondary text-muted-foreground border border-border">
                      <User className="size-5 shrink-0" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover border border-border text-popover-foreground shadow-lg" align="end" alignOffset={5} forceMount>
                <UserProfileDropdown
                  userCard={
                    <DropdownMenuItem asChild className="cursor-pointer font-normal p-2.5 min-w-0 focus:bg-accent focus:text-accent-foreground w-full">
                      <a href="https://account.nyxoris.com" className="w-full">
                        <UserProfileCard
                          name={profile?.displayName || (user?.preferred_username as string) || (user?.name as string) || 'Người dùng'}
                          avatarSrc={profile?.avatarUrl || user?.picture || user?.avatar || ''}
                          subtext="Gói: Miễn phí"
                          showChevron={true}
                        />
                      </a>
                    </DropdownMenuItem>
                  }
                  menuItems={
                    <>
                      <DropdownMenuItem asChild className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                        <a href={storeBaseUrl}>
                          <Store className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                          <span>Cửa hàng Nyxoris</span>
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                        <a href={`${storeBaseUrl}/space?tab=orders`}>
                          <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                          <span>Đơn hàng của tôi</span>
                        </a>
                      </DropdownMenuItem>
                    </>
                  }
                  portals={portals.map((portal) => ({
                    id: portal.id,
                    name: portal.name,
                    icon: portal.icon,
                    href: portal.url,
                    active: portal.active,
                    target: portal.active ? '_blank' : undefined,
                    rel: portal.active ? 'noreferrer' : undefined,
                  }))}
                  currentPortalId="payment"
                  logoutItem={
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer focus:bg-destructive/10">
                      <LogOut className="mr-2 h-4 w-4 shrink-0" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />
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
