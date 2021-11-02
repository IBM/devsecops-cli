import axios, { AxiosInstance, AxiosError } from 'axios';
import { Logger } from '@devsecops-cli/logger';

interface Config {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
}

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface API {
  request<T>(method: Method, url: string, body?: unknown, params?: Config): Promise<{ data: T; headers: any }>;
  get<T>(url: string, params?: Config): Promise<{ data: T }>;
  post<T>(url: string, body: unknown): Promise<{ data: T }>;
  patch<T>(url: string, body: unknown): Promise<{ data: T }>;
  put<T>(url: string, body: unknown): Promise<{ data: T }>;
  delete<T>(url: string, body?: unknown): Promise<{ data: T }>;
}

class AxiosAPI implements API {
  private readonly config: Config;
  private readonly logger: Logger;
  private readonly client: AxiosInstance;

  constructor(
    config: Record<string, unknown>,
    logger: Logger,
    client?: AxiosInstance,
  ) {
    this.config = config;
    this.logger = logger;
    this.client = client ?? axios.create({
      maxContentLength: Infinity,
    });

    this.client.interceptors.response.use((response) => {
      this.logger.debug(`${response.config.method} | ${response.config.url}: ${response.status}`);
      return response;
    }, (error) => {
      this.logger.debug(`${error.config.method} | ${error.config.url}: ${error.response?.status ?? 'N/A'}`);
      return Promise.reject(error);
    });
  }

  request<T>(method: Method, url: string, data?: unknown, config: Config = {}) {
    return this.client.request<T>({
      url,
      method,
      data,
      ...this.config,
      ...config,
      headers: {
        ...this.config.headers,
        ...config.headers,
      },
    });
  }

  get<T>(url: string, config?: Config) {
    return this.request<T>('get', url, undefined, config);
  }

  post<T>(url: string, body: unknown, config?: Config) {
    return this.request<T>('post', url, body, config);
  }

  put<T>(url: string, body: unknown, config?: Config) {
    return this.request<T>('put', url, body, config);
  }

  patch<T>(url: string, body: unknown, config?: Config) {
    return this.request<T>('patch', url, body, config);
  }

  delete<T>(url: string, body?: unknown, config?: Config) {
    return this.request<T>('delete', url, body, config);
  }
}

function isAxiosError(e: unknown): e is AxiosError {
  return typeof e == 'object' && e != null && 'isAxiosError' in e;
}

export { AxiosAPI, API, Method, Config, isAxiosError };
