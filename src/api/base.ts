import isObject from 'lodash/isObject';

type Param = string | number | boolean | Param[];

export const stringifyParams = (params: { [key: string]: any }) =>
  JSON.stringify(params, (_, value) => {
    if (value === null || value === '') {
      return undefined;
    }

    return value;
  });

export const normalizeParams = (params: { [key: string]: any }) =>
  Object.keys(params || {})
    .filter((key) => params[key] !== '' && params[key] !== null && params[key] !== undefined)
    .map((key) => `${key}=${encodeURIComponent(isObject(params[key]) ? stringifyParams(params[key]) : params[key])}`)
    .join('&');

class BaseApiClient {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(method: 'GET' | 'POST', url: string, params?: Record<string, Param>, data?: Object) {
    const accessToken = this.getAccessToken();

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${url}?${normalizeParams(params)}`, {
        method,
        headers,
        body: stringifyParams(data),
      });

      if (response.status === 401) {
        this.clearTokens();
      }

      const json = await response.json();

      return json as T;
    } catch (ex) {
      return ({
        error: ex.toString() as string,
      } as unknown) as T;
    }
  }

  protected get<T>(url: string, params?: Record<string, Param>) {
    return this.request<T>('GET', url, params);
  }

  protected post<T>(url: string, data?: Object, params?: Record<string, Param>) {
    return this.request<T>('POST', url, params, data);
  }

  protected getAccessToken(): string {
    throw new Error('not implemented');
  }

  protected getRefreshToken(): string {
    throw new Error('not implemented');
  }

  protected saveTokens({
    access_token,
    refresh_token,
    expires_in,
  }: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }): void | Promise<void> {
    throw new Error('not implemented');
  }

  protected clearTokens(): void | Promise<void> {
    throw new Error('not implemented');
  }
}

export default BaseApiClient;
