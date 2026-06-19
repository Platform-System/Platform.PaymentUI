import { createContext, useContext } from 'react';
import type { KeycloakTokenParsed } from 'keycloak-js';

export type AuthUser = (KeycloakTokenParsed & Record<string, unknown>) | null;

export interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  login: () => void;
  logout: () => void;
  token: string | undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
