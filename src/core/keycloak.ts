import { configurePlatformApi, getKeycloak, getValidToken as getValidTokenShared } from '@platform-system/api-client';
import { getEnv } from '@/shared/config/env';

const keycloakUrl = getEnv('VITE_KEYCLOAK_URL');
const realm = getEnv('VITE_KEYCLOAK_REALM');
const clientId = getEnv('VITE_KEYCLOAK_CLIENT_ID');

configurePlatformApi({
  baseURL: getEnv('VITE_API_URL'),
  keycloak: {
    url: keycloakUrl,
    realm: realm,
    clientId: clientId,
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/transactions' : undefined,
  },
  onUnauthorized: () => {
    const kc = getKeycloak();
    if (kc) {
      kc.logout({ redirectUri: window.location.origin + '/transactions' });
    }
  }
});

export const keycloak = getKeycloak()!;
export const getValidToken = getValidTokenShared;
