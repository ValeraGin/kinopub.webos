import storage from 'storage';

import KinopubApiClient from './kinopub';

class ApiClient extends KinopubApiClient {
  constructor() {
    super(
      process.env.REACT_APP_KINOPUB_API_CLIENT_ID,
      process.env.REACT_APP_KINOPUB_API_CLIENT_SECRET,
      process.env.REACT_APP_KINOPUB_API_BASE_URL,
    );
  }

  isLogged() {
    return storage.getItem<boolean>('is_logged');
  }

  protected getAccessToken() {
    return storage.getItem<string>('access_token');
  }

  protected getRefreshToken() {
    return storage.getItem<string>('refresh_token');
  }

  protected saveTokens({ access_token, refresh_token, expires_in }: { access_token: string; refresh_token: string; expires_in: number }) {
    storage.setItem('is_logged', true, 30 * 24 * 3600);
    storage.setItem('access_token', access_token, expires_in);
    storage.setItem('refresh_token', refresh_token, 30 * 24 * 3600);
  }

  protected clearTokens() {
    (['is_logged', 'access_token', 'refresh_token'] as const).forEach(storage.removeItem);
  }
}

export default ApiClient;
