import React, { useEffect, useState, useRef } from 'react';
import { Spinner } from '@platform-system/design-ui/components/spinner';
import { keycloak } from './keycloak';
import { AuthContext, type AuthUser } from './auth-context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || !keycloak) return;
    initRef.current = true;

    keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      enableLogging: false,
    })
      .then((authenticated) => {
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
      .catch((error) => {
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
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-10 w-10 text-white animate-spin" />
          <p className="text-sm font-medium text-neutral-400">Đang khởi tạo quyền truy cập...</p>
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
        logout: () => keycloak?.logout({ redirectUri: window.location.origin + '/transactions' }),
        token: keycloak?.token,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
