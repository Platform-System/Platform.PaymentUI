import { useQuery } from '@tanstack/react-query';
import { getCurrentUserTransactions } from '../api/transactionsApi';

export function useTransactions(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['transactions', page, pageSize],
    queryFn: () => getCurrentUserTransactions(page, pageSize),
  });
}
