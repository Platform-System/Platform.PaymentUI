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

export const TransactionsDashboardScreen: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const { data: pagedData, isLoading, refetch, isFetching } = useTransactions(page, pageSize);
  const transactions = pagedData?.items || [];
  const totalCount = pagedData?.totalCount || 0;
  const { logout, user } = useAuth();

  const formatMoney = (value: number, currency?: string) => {
    return value.toLocaleString('vi-VN') + ' ' + (currency === 'VND' || !currency ? 'đ' : currency);
  };

  const getPlatformLabel = (refType: string) => {
    switch (refType.toLowerCase()) {
      case 'order':
        return { label: 'Đơn hàng Merchant', icon: <ShoppingBag size={14} className="text-neutral-400" /> };
      case 'wallettopup':
        return { label: 'Nạp tiền ví', icon: <Wallet size={14} className="text-neutral-400" /> };
      default:
        return { label: refType, icon: <CreditCard size={14} className="text-neutral-400" /> };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]">
            <CheckCircle2 size={12} className="stroke-[2]" />
            Đã thanh toán
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-neutral-400 border border-neutral-800">
            <XCircle size={12} className="stroke-[2]" />
            Đã hủy
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
            <AlertCircle size={12} className="stroke-[2]" />
            Chờ thanh toán
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-neutral-400 border border-neutral-800">
            {status}
          </span>
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
    <div className="min-h-screen bg-neutral-950 text-white font-sans relative overflow-hidden flex flex-col select-none">
      {/* Background Grid and Atmosphere Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[10%] left-[30%] w-[500px] h-[500px] rounded-full bg-neutral-800/10 blur-[150px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-neutral-900/20 blur-[120px]" />
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" 
          style={{ maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)' }}
        />
      </div>

      {/* Navigation Header */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50 h-20 flex items-center justify-between px-6 md:px-12 lg:px-16 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-white text-neutral-950 p-2 rounded-xl flex items-center justify-center shadow-sm">
            <ShieldCheck size={20} className="stroke-[1.5]" />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight text-white">
            Nyxoris <span className="font-sans text-xs font-medium text-neutral-500 uppercase tracking-widest ml-1">Portal</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
            <User size={13} className="text-neutral-500" />
            <span>{user?.name || user?.preferred_username || 'Khách hàng'}</span>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={logout}
            className="flex items-center gap-1.5 border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Đăng xuất</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 py-10 relative z-10 space-y-10 min-h-0">
        {/* Page title and refresh */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight">Hóa đơn & Giao dịch</h1>
            <p className="text-neutral-400 text-sm mt-1">Tổng hợp và quản lý hóa đơn thanh toán của bạn trên toàn hệ sinh thái Nyxoris</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 border-neutral-800 text-neutral-400 hover:text-white"
          >
            <RotateCw size={14} className={isFetching ? 'animate-spin' : ''} />
            <span>Làm mới</span>
          </Button>
        </div>

        {/* Overview Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="ds-glass-card p-6 rounded-3xl border border-neutral-800 bg-neutral-950/40 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-emerald-500/20">
              <TrendingUp size={48} className="stroke-[1.5]" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Tổng chi tiêu</span>
            <div className="text-3xl font-extrabold tracking-tight mt-2 text-emerald-400">
              {isLoading ? '...' : formatMoney(totalSpent)}
            </div>
            <p className="text-xs text-neutral-500 mt-2">Tổng số tiền giao dịch đã thanh toán thành công</p>
          </div>

          <div className="ds-glass-card p-6 rounded-3xl border border-neutral-800 bg-neutral-950/40 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-amber-500/20">
              <AlertCircle size={48} className="stroke-[1.5]" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Chờ thanh toán</span>
            <div className="text-3xl font-extrabold tracking-tight mt-2 text-amber-400">
              {isLoading ? '...' : `${pendingCount} hóa đơn`}
            </div>
            <p className="text-xs text-neutral-500 mt-2">Yêu cầu giao dịch đang chờ xử lý thanh toán</p>
          </div>

          <div className="ds-glass-card p-6 rounded-3xl border border-neutral-800 bg-neutral-950/40 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-neutral-500/20">
              <CreditCard size={48} className="stroke-[1.5]" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Tổng số giao dịch</span>
            <div className="text-3xl font-extrabold tracking-tight mt-2 text-white">
              {isLoading ? '...' : `${totalTransactions} lượt`}
            </div>
            <p className="text-xs text-neutral-500 mt-2">Tổng số hóa đơn phát sinh trên hệ thống</p>
          </div>
        </div>

        {/* Transactions Table Section */}
        <div className="ds-glass-card rounded-[30px] border border-neutral-800/80 bg-neutral-950/25 overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Spinner className="h-8 w-8 spinner-accent" />
              <p className="text-sm text-neutral-500">Đang tải lịch sử giao dịch...</p>
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="h-14 w-14 bg-neutral-900 text-neutral-500 rounded-2xl border border-neutral-800 flex items-center justify-center">
                <CreditCard size={24} />
              </div>
              <h3 className="font-semibold text-lg">Chưa có giao dịch nào</h3>
              <p className="text-neutral-500 text-xs max-w-xs leading-relaxed">
                Tài khoản của bạn hiện tại chưa phát sinh bất kỳ yêu cầu thanh toán hay hóa đơn nào từ các nền tảng liên kết.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 text-xs font-bold tracking-wider text-neutral-400 uppercase bg-neutral-950/60">
                    <th className="py-5 px-6">Mã tham chiếu</th>
                    <th className="py-5 px-6">Nguồn nền tảng</th>
                    <th className="py-5 px-6">Số tiền</th>
                    <th className="py-5 px-6">Ngày tạo</th>
                    <th className="py-5 px-6">Trạng thái</th>
                    <th className="py-5 px-6 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/60 text-sm">
                  {transactions.map((t) => {
                    const platform = getPlatformLabel(t.referenceType);
                    return (
                      <tr key={t.paymentId} className="hover:bg-neutral-900/20 transition-colors">
                        <td className="py-4.5 px-6 font-semibold tracking-tight text-white">
                          #{t.referenceCode}
                        </td>
                        <td className="py-4.5 px-6">
                          <div className="flex items-center gap-2">
                            {platform.icon}
                            <span className="font-medium text-neutral-300">{platform.label}</span>
                          </div>
                        </td>
                        <td className="py-4.5 px-6 font-bold text-neutral-200">
                          {formatMoney(t.amount, t.currency)}
                        </td>
                        <td className="py-4.5 px-6 text-neutral-400 text-xs">
                          {new Date(t.createdAt).toLocaleString('vi-VN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </td>
                        <td className="py-4.5 px-6">
                          {getStatusBadge(t.status)}
                        </td>
                        <td className="py-4.5 px-6 text-right">
                          {t.status.toLowerCase() === 'pending' && t.checkoutUrl ? (
                            <Button 
                              size="sm" 
                              onClick={() => {
                                window.location.href = t.checkoutUrl || '';
                              }}
                              className="flex items-center gap-1 ml-auto bg-white text-neutral-950 hover:bg-neutral-200 font-semibold"
                            >
                              Thanh toán
                              <ArrowUpRight size={14} />
                            </Button>
                          ) : (
                            <span className="text-xs text-neutral-600 font-medium pr-4">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {/* Pagination Controls */}
              {totalCount > pageSize && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-900 bg-neutral-950/40 text-sm text-neutral-400">
                  <div>
                    Hiển thị <span className="font-semibold text-white">{Math.min((page - 1) * pageSize + 1, totalCount)}</span> đến <span className="font-semibold text-white">{Math.min(page * pageSize, totalCount)}</span> trong tổng số <span className="font-semibold text-white">{totalCount}</span> giao dịch
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(p => Math.max(p - 1, 1))}
                      className="border-neutral-800 disabled:opacity-40"
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page * pageSize >= totalCount}
                      onClick={() => setPage(p => p + 1)}
                      className="border-neutral-800 disabled:opacity-40"
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
