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
    // The API returns the token in "authorization"; send it as the Authorization header for protected routes.
    return this.client.post<LoginResponse>('/login', { data: payload });
  }
}
