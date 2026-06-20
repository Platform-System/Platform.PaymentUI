import React, { useState } from 'react';
import { 
  RotateCw, 
  ShoppingBag, 
  AlertCircle, 
  CheckCircle2, 
  Wallet, 
  CreditCard, 
  XCircle, 
  ArrowUpRight, 
  Search 
} from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { Badge, Button, Card, CardContent, EmptyStatePanel, FilterBar, Spinner, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@platform-system/design-ui';

export const OrderSelectionScreen: React.FC = () => {
  // Pagination and hook for orders list
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { data: pagedData, isLoading, refetch, isFetching } = useTransactions(page, pageSize);
  const transactions = pagedData?.items || [];
  const totalCount = pagedData?.totalCount || 0;

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  // Filter transactions locally (client-side)
  const filteredTransactions = transactions.filter((t) => {
    // 1. Category Filter
    if (activeCategory !== 'Tất cả') {
      const typeLower = t.referenceType.toLowerCase();
      if (activeCategory === 'Merchant Store' && typeLower !== 'order') return false;
      if (activeCategory === 'Nạp tiền ví' && typeLower !== 'wallettopup') return false;
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const refCodeStr = `#${t.referenceCode}`;
      const refCodeStrRaw = t.referenceCode.toString();
      const typeLower = t.referenceType.toLowerCase();
      
      const platformLabel = typeLower === 'order' 
        ? 'merchant store' 
        : typeLower === 'wallettopup' 
          ? 'nạp tiền ví' 
          : typeLower;

      const matchesCode = refCodeStr.includes(query) || refCodeStrRaw.includes(query);
      const matchesPlatform = platformLabel.includes(query);

      if (!matchesCode && !matchesPlatform) return false;
    }

    return true;
  });

  return (
    <main id="payment-scroll-container" className="flex-1 overflow-y-auto w-full relative z-10 min-h-0">
      <div className="max-w-5xl w-full mx-auto px-6 md:px-12 py-10 space-y-8">
        {/* Page title and refresh */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">Cổng thanh toán</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <RotateCw size={14} className={isFetching ? 'animate-spin' : ''} />
            <span>Làm mới</span>
          </Button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden border-primary bg-white text-primary shadow-sm transition-all hover:shadow-md">
            <CardContent className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Chờ thanh toán</span>
                <div className="text-2xl font-black text-primary tracking-tight mt-1">
                  {isLoading ? '...' : `${transactions.filter(t => t.status.toLowerCase() === 'pending').length} hóa đơn`}
                </div>
              </div>
              <div className="text-warning bg-primary p-2.5 rounded-xl shrink-0 border border-primary/20 shadow-sm">
                <AlertCircle size={20} className="stroke-[1.5]" />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-primary bg-white text-primary shadow-sm transition-all hover:shadow-md">
            <CardContent className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Đã hoàn thành</span>
                <div className="text-2xl font-black text-primary tracking-tight mt-1">
                  {isLoading ? '...' : `${transactions.filter(t => t.status.toLowerCase() === 'paid').length} hóa đơn`}
                </div>
              </div>
              <div className="text-success bg-primary p-2.5 rounded-xl shrink-0 border border-primary/20 shadow-sm">
                <CheckCircle2 size={20} className="stroke-[1.5]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={['Merchant Store', 'Nạp tiền ví']}
          searchPlaceholder="Tìm theo mã đơn hàng hoặc nhà bán hàng..."
          includeAllOption
          variant="panel"
          className="w-full"
        />

        {/* Transactions List Section */}
        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Spinner className="h-8 w-8 spinner-accent" />
                <p className="text-sm text-muted-foreground">Đang tải danh sách đơn hàng...</p>
              </div>
            ) : !transactions || transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-14 w-14 bg-secondary text-muted-foreground rounded-2xl border border-border flex items-center justify-center">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Chưa có đơn hàng nào</h3>
                <p className="text-muted-foreground text-xs max-w-xs leading-relaxed">
                  Tài khoản của bạn hiện tại chưa phát sinh bất kỳ yêu cầu thanh toán hay đơn hàng nào.
                </p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-6">
                <EmptyStatePanel
                  icon={<Search size={28} className="text-muted-foreground" />}
                  title="Không tìm thấy kết quả"
                  description="Không tìm thấy yêu cầu thanh toán nào phù hợp với bộ lọc của bạn. Vui lòng thử lại với từ khóa khác."
                  primaryActionNode={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('Tất cả');
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-5 px-6 h-auto font-bold text-xs uppercase tracking-wider text-muted-foreground">Mã đơn hàng</TableHead>
                      <TableHead className="py-5 px-6 h-auto font-bold text-xs uppercase tracking-wider text-muted-foreground">Nhà bán hàng</TableHead>
                      <TableHead className="py-5 px-6 h-auto font-bold text-xs uppercase tracking-wider text-muted-foreground">Số tiền</TableHead>
                      <TableHead className="py-5 px-6 h-auto font-bold text-xs uppercase tracking-wider text-muted-foreground">Ngày tạo</TableHead>
                      <TableHead className="py-5 px-6 h-auto font-bold text-xs uppercase tracking-wider text-muted-foreground">Trạng thái</TableHead>
                      <TableHead className="py-5 px-6 h-auto font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((t) => {
                      const getPlatformLabel = (refType: string) => {
                        switch (refType.toLowerCase()) {
                          case 'order':
                            return { label: 'Merchant Store', icon: <ShoppingBag size={14} className="text-muted-foreground" /> };
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
                            {t.amount.toLocaleString('vi-VN')} {t.currency === 'VND' || !t.currency ? 'đ' : t.currency}
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
                        className="border-border text-muted-foreground disabled:opacity-40 cursor-pointer hover:bg-muted/50"
                      >
                        Trước
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page * pageSize >= totalCount}
                        onClick={() => setPage(p => p + 1)}
                        className="border-border text-muted-foreground disabled:opacity-40 cursor-pointer hover:bg-muted/50"
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
  );
};
