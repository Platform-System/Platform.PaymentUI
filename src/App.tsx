import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@platform-system/design-ui/theme-provider';
import { CheckoutScreen } from './features/checkout';
import { AuthProvider } from './core/AuthProvider';
import { TransactionsDashboardScreen } from './features/dashboard/screens/TransactionsDashboardScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Main checkout routes */}
            <Route path="/checkout" element={<CheckoutScreen />} />
            <Route path="/checkout/:referenceCode" element={<CheckoutScreen />} />
            
            {/* Transaction history portal */}
            <Route path="/transactions" element={
              <AuthProvider>
                <TransactionsDashboardScreen />
              </AuthProvider>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/checkout" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
