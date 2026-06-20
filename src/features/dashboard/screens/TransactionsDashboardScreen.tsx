import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../../../core/auth-context';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  CreditCard, 
  LogOut, 
  User, 
  ArrowUpRight, 
  ShieldCheck, 
  Wallet, 
  ShoppingBag,
  TrendingUp,
  RotateCw
} from 'lucide-react';
import { Button } from '@platform-system/design-ui/components/button';
import { Spinner } from '@platform-system/design-ui/components/spinner';
import { Card, CardContent } from '@platform-system/design-ui/components/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@platform-system/design-ui/components/table';
import { Badge } from '@platform-system/design-ui/components/badge';
import { TopbarShell } from '@platform-system/design-ui/components/topbar-shell';
import { cn } from '@platform-system/design-ui/lib/cn';

export const TransactionsDashboardScreen: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const { data: pagedData, isLoading, refetch, isFetching } = useTransactions(page, pageSize);
  const transactions = pagedData?.items || [];
  const totalCount = pagedData?.totalCount || 0;
  const { logout, user } = useAuth();

  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const container = document.getElementById('dashboard-scroll-container');
    const handleScroll = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      setIsScrolled(target.scrollTop > 20);
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
      setTimeout(() => {
        setIsScrolled(container.scrollTop > 20);
      }, 0);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const formatMoney = (value: number, currency?: string) => {
    return value.toLocaleString('vi-VN') + ' ' + (currency === 'VND' || !currency ? 'đ' : currency);
  };

  const getPlatformLabel = (refType: string) => {
    switch (refType.toLowerCase()) {
      case 'order':
        return { label: 'Đơn hàng Merchant', icon: <ShoppingBag size={14} className="text-muted-foreground" /> };
      case 'wallettopup':
        return { label: 'Nạp tiền ví', icon: <Wallet size={14} className="text-muted-foreground" /> };
      default:
        return { label: refType, icon: <CreditCard size={14} className="text-muted-foreground" /> };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return (
          <Badge variant="success" className="gap-1 px-2.5 py-1">
            <CheckCircle2 size={12} className="stroke-[2]" />
            Đã thanh toán
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="gap-1 px-2.5 py-1">
            <XCircle size={12} className="stroke-[2]" />
            Đã hủy
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="gap-1 px-2.5 py-1 animate-pulse">
            <AlertCircle size={12} className="stroke-[2]" />
            Chờ thanh toán
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1 px-2.5 py-1">
            {status}
          </Badge>
        );
    }
  };

  // Compute stats
  const totalSpent = transactions
    ?.filter(t => t.status.toLowerCase() === 'paid')
    ?.reduce((sum, t) => sum + t.amount, 0) || 0;

  const pendingCount = transactions
    ?.filter(t => t.status.toLowerCase() === 'pending')
    ?.length || 0;

  const totalTransactions = totalCount;

  return (
    <div className="h-screen bg-background text-foreground font-sans relative overflow-hidden flex flex-col select-none">
      {/* Background Grid and Atmosphere Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[10%] left-[30%] w-[500px] h-[500px] rounded-full bg-muted/40 blur-[150px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-muted/30 blur-[120px]" />
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px]" 
          style={{ maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)' }}
        />
      </div>

      {/* Navigation Header */}
      <TopbarShell 
        className={cn(
          "px-6 md:px-12 lg:px-16 transition-all duration-500",
          isScrolled 
            ? "h-14 border-b border-border bg-background/88 shadow-[0_14px_32px_rgba(17,17,17,0.05)] backdrop-blur-xl" 
            : "h-20 border-b border-transparent bg-background/80 backdrop-blur-md"
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-foreground text-background p-2 rounded-xl flex items-center justify-center shadow-sm">
            <ShieldCheck size={20} className="stroke-[1.5]" />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight text-foreground">
            Nyxoris <span className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-widest ml-1">Portal</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary border border-border text-xs text-foreground">
            <User size={13} className="text-muted-foreground" />
            <span>{user?.name || user?.preferred_username || 'Khách hàng'}</span>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={logout}
            className="flex items-center gap-1.5 border-border text-muted-foreground hover:text-foreground"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Đăng xuất</span>
          </Button>
        </div>
      </TopbarShell>

      {/* Main Content Area */}
      <main id="dashboard-scroll-container" className="flex-1 overflow-y-auto w-full relative z-10 min-h-0">
        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 py-10 space-y-10">
        {/* Page title and refresh */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight">Hóa đơn & Giao dịch</h1>
            <p className="text-muted-foreground text-sm mt-1">Tổng hợp và quản lý hóa đơn thanh toán của bạn trên toàn hệ sinh thái Nyxoris</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 border-border text-muted-foreground hover:text-foreground"
          >
            <RotateCw size={14} className={isFetching ? 'animate-spin' : ''} />
            <span>Làm mới</span>
          </Button>
        </div>

        {/* Overview Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden bg-card text-card-foreground border-border/80">
            <CardContent className="p-6">
              <div className="absolute top-4 right-4 text-success/20">
                <TrendingUp size={48} className="stroke-[1.5]" />
              </div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Tổng chi tiêu</span>
              <div className="text-3xl font-extrabold tracking-tight mt-2 text-success">
                {isLoading ? '...' : formatMoney(totalSpent)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Tổng số tiền giao dịch đã thanh toán thành công</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-card text-card-foreground border-border/80">
            <CardContent className="p-6">
              <div className="absolute top-4 right-4 text-warning/20">
                <AlertCircle size={48} className="stroke-[1.5]" />
              </div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Chờ thanh toán</span>
              <div className="text-3xl font-extrabold tracking-tight mt-2 text-warning">
                {isLoading ? '...' : `${pendingCount} hóa đơn`}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Yêu cầu giao dịch đang chờ xử lý thanh toán</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-card text-card-foreground border-border/80">
            <CardContent className="p-6">
              <div className="absolute top-4 right-4 text-muted-foreground/20">
                <CreditCard size={48} className="stroke-[1.5]" />
              </div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Tổng số giao dịch</span>
              <div className="text-3xl font-extrabold tracking-tight mt-2 text-foreground">
                {isLoading ? '...' : `${totalTransactions} lượt`}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Tổng số hóa đơn phát sinh trên hệ thống</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table Section */}
        <Card className="overflow-hidden border-border/80 shadow-md">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Spinner className="h-8 w-8 spinner-accent" />
                <p className="text-sm text-muted-foreground">Đang tải lịch sử giao dịch...</p>
              </div>
            ) : !transactions || transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-14 w-14 bg-secondary text-muted-foreground rounded-2xl border border-border flex items-center justify-center">
                  <CreditCard size={24} />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Chưa có giao dịch nào</h3>
                <p className="text-muted-foreground text-xs max-w-xs leading-relaxed">
                  Tài khoản của bạn hiện tại chưa phát sinh bất kỳ yêu cầu thanh toán hay hóa đơn nào từ các nền tảng liên kết.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-5 px-6 h-auto font-bold text-xs uppercase tracking-wider text-muted-foreground">Mã tham chiếu</TableHead>
                      <TableHead className="py-5 px-6 h-auto font-bold text-xs uppercase tracking-wider text-muted-foreground">Nguồn nền tảng</TableHead>
                      <TableHead className="py-5 px-6 h-auto font-bold text-xs uppercase tracking-wider text-muted-foreground">Số tiền</TableHead>
                      <TableHead className="py-5 px-6 h-auto font-bold text-xs uppercase tracking-wider text-muted-foreground">Ngày tạo</TableHead>
                      <TableHead className="py-5 px-6 h-auto font-bold text-xs uppercase tracking-wider text-muted-foreground">Trạng thái</TableHead>
                      <TableHead className="py-5 px-6 h-auto font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((t) => {
                      const platform = getPlatformLabel(t.referenceType);
                      return (
                        <TableRow key={t.paymentId}>
                          <TableCell className="py-4 px-6 font-semibold tracking-tight text-foreground">
                            #{t.referenceCode}
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {platform.icon}
                              <span className="font-medium text-muted-foreground">{platform.label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6 font-bold text-foreground">
                            {formatMoney(t.amount, t.currency)}
                          </TableCell>
                          <TableCell className="py-4 px-6 text-muted-foreground text-xs">
                            {new Date(t.createdAt).toLocaleString('vi-VN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            {getStatusBadge(t.status)}
                          </TableCell>
                          <TableCell className="py-4 px-6 text-right">
                            {t.status.toLowerCase() === 'pending' && t.checkoutUrl ? (
                              <Button 
                                size="sm" 
                                onClick={() => {
                                  window.location.href = t.checkoutUrl || '';
                                }}
                                className="flex items-center gap-1 ml-auto font-semibold cursor-pointer"
                              >
                                Thanh toán
                                <ArrowUpRight size={14} />
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground/60 font-medium pr-4">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                
                {/* Pagination Controls */}
                {totalCount > pageSize && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-border/80 bg-muted/20 text-sm text-muted-foreground">
                    <div>
                      Hiển thị <span className="font-semibold text-foreground">{Math.min((page - 1) * pageSize + 1, totalCount)}</span> đến <span className="font-semibold text-foreground">{Math.min(page * pageSize, totalCount)}</span> trong tổng số <span className="font-semibold text-foreground">{totalCount}</span> giao dịch
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        className="border-border text-muted-foreground disabled:opacity-40"
                      >
                        Trước
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page * pageSize >= totalCount}
                        onClick={() => setPage(p => p + 1)}
                        className="border-border text-muted-foreground disabled:opacity-40"
                      >
                        Sau
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
};
