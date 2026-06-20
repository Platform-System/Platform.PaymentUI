import React from 'react';

interface RootErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

export class RootErrorBoundary extends React.Component<React.PropsWithChildren, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('RootErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6">
          <div className="ds-glass-panel w-full max-w-2xl rounded-3xl p-8 border border-border shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-destructive">Runtime Error</p>
            <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-foreground">Ứng dụng đã gặp lỗi khi hiển thị</h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {this.state.errorMessage || 'Đã có lỗi xảy ra trong quá trình hiển thị giao diện.'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
