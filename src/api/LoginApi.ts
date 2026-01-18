import { ApiClient } from './ApiClient';
import type { APIRequestContext } from '@playwright/test';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  authorization: string;
};

export class LoginApi {
  private readonly client: ApiClient;
  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  login(payload: LoginRequest) {
    // Swagger/Doc: token retornado em "authorization" e deve ser enviado no header Authorization nas rotas protegidas. citeturn10view0
    return this.client.post<LoginResponse>('/login', { data: payload });
  }
}
