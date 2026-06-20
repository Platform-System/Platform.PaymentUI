import { configurePlatformApi, getKeycloak, getValidToken as getValidTokenShared } from '@platform-system/api-client';

const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
const realm = import.meta.env.VITE_KEYCLOAK_REALM;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

configurePlatformApi({
  baseURL: import.meta.env.VITE_API_URL || '', // Relative proxying in Vite
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
