import type { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get<T>(url: string, options?: Parameters<APIRequestContext['get']>[1]): Promise<{ res: APIResponse; body: T }> {
    const res = await this.request.get(url, options);
    const body = (await res.json()) as T;
    return { res, body };
  }

  async post<T>(url: string, options?: Parameters<APIRequestContext['post']>[1]): Promise<{ res: APIResponse; body: T }> {
    const res = await this.request.post(url, options);
    const body = (await res.json()) as T;
    return { res, body };
  }

  async put<T>(url: string, options?: Parameters<APIRequestContext['put']>[1]): Promise<{ res: APIResponse; body: T }> {
    const res = await this.request.put(url, options);
    const body = (await res.json()) as T;
    return { res, body };
  }

  async del<T>(url: string, options?: Parameters<APIRequestContext['delete']>[1]): Promise<{ res: APIResponse; body: T }> {
    const res = await this.request.delete(url, options);
    const body = (await res.json()) as T;
    return { res, body };
  }
}
