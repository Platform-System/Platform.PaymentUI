import React, { useEffect, useState, useRef } from 'react';
import { Spinner } from '@platform-system/design-ui';
import { keycloak } from './keycloak';
import { AuthContext, type AuthUser } from './auth-context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(!keycloak);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (!keycloak) {
      console.error('Keycloak instance is not initialized. Please ensure VITE_KEYCLOAK_URL, VITE_KEYCLOAK_REALM, and VITE_KEYCLOAK_CLIENT_ID are set at build time.');
      return;
    }

    if (initRef.current) return;
    initRef.current = true;

    keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      enableLogging: false,
    })
      .then((authenticated: boolean) => {
        setIsAuthenticated(authenticated);
        if (authenticated) {
          const nextUser: AuthUser = keycloak.tokenParsed
            ? {
                ...keycloak.idTokenParsed,
                ...keycloak.tokenParsed,
              }
            : null;
          setUser(nextUser);
        }
        setIsInitialized(true);
      })
      .catch((error: unknown) => {
        console.error('Keycloak initialization failed in PaymentUI', error);
        setIsInitialized(true);
      });

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).catch(() => {
        console.error('Failed to refresh token, forcing logout');
        keycloak.logout();
      });
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground font-sans">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-10 w-10 spinner-accent" />
          <p className="text-sm font-medium text-muted-foreground">Đang khởi tạo quyền truy cập...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        login: () => keycloak?.login().catch(console.error),
        logout: () => keycloak?.logout({ redirectUri: window.location.origin + '/' }),
        token: keycloak?.token,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
