import { ApiClient } from './ApiClient';
import type { APIRequestContext } from '@playwright/test';

export type UsuarioCreateRequest = {
  nome: string;
  email: string;
  password: string;
  administrador: 'true' | 'false';
};

export type UsuarioCreateResponse = {
  message: string;
  _id: string;
};

export class UsuariosApi {
  private readonly client: ApiClient;
  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  criar(usuario: UsuarioCreateRequest) {
    return this.client.post<UsuarioCreateResponse>('/usuarios', { data: usuario });
  }
}
