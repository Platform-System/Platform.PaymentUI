import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@platform-system/design-ui/theme-provider';
import { CheckoutScreen } from './features/checkout';
import { AuthProvider } from './core/AuthProvider';
import { TransactionsDashboardScreen } from './features/dashboard';
import { RootErrorBoundary } from './core/RootErrorBoundary';

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
      <RootErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              {/* Main checkout routes */}
              <Route path="/" element={
                <AuthProvider>
                  <CheckoutScreen />
                </AuthProvider>
              } />
              <Route path="/checkout" element={
                <AuthProvider>
                  <CheckoutScreen />
                </AuthProvider>
              } />
              <Route path="/checkout/:referenceCode" element={
                <AuthProvider>
                  <CheckoutScreen />
                </AuthProvider>
              } />
              
              {/* Transaction history portal */}
              <Route path="/transactions" element={
                <AuthProvider>
                  <TransactionsDashboardScreen />
                </AuthProvider>
              } />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </RootErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
