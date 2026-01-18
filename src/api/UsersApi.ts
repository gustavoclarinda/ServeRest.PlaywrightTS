import { ApiClient } from './ApiClient';
import type { APIRequestContext } from '@playwright/test';

type UserCreateApiRequest = {
  nome: string;
  email: string;
  password: string;
  administrador: 'true' | 'false';
};

type UserCreateApiResponse = {
  message: string;
  _id: string;
};

export type UserCreateRequest = {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

export type UserCreateResponse = {
  message: string;
  id: string;
};

const toUserCreatePayload = (user: UserCreateRequest): UserCreateApiRequest => ({
  nome: user.name,
  email: user.email,
  password: user.password,
  administrador: user.isAdmin ? 'true' : 'false'
});

export class UsersApi {
  private readonly client: ApiClient;
  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  async create(user: UserCreateRequest) {
    const { res, body } = await this.client.post<UserCreateApiResponse>('/usuarios', { data: toUserCreatePayload(user) });
    return { res, body: { message: body.message, id: body._id } satisfies UserCreateResponse };
  }
}
