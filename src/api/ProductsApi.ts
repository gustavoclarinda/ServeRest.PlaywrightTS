import { ApiClient } from './ApiClient';
import type { APIRequestContext } from '@playwright/test';

type ProductApiPayload = {
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
  _id?: string;
};

type ProductListApiResponse = {
  quantidade: number;
  produtos: ProductApiPayload[];
};

type MessageIdApiResponse = {
  message: string;
  _id?: string;
};

export type Product = {
  name: string;
  price: number;
  description: string;
  quantity: number;
  id?: string;
};

export type ProductListResponse = {
  total: number;
  products: Product[];
};

export type MessageIdResponse = {
  message: string;
  id?: string;
};

const toProductPayload = (product: Product): ProductApiPayload => ({
  nome: product.name,
  preco: product.price,
  descricao: product.description,
  quantidade: product.quantity,
  _id: product.id
});

const fromProductPayload = (payload: ProductApiPayload): Product => ({
  name: payload.nome,
  price: payload.preco,
  description: payload.descricao,
  quantity: payload.quantidade,
  id: payload._id
});

const toProductQuery = (
  query?: Partial<Pick<Product, 'name' | 'price' | 'description' | 'quantity'>> & { id?: string }
) =>
  query
    ? {
      nome: query.name,
      preco: query.price,
      descricao: query.description,
      quantidade: query.quantity,
      _id: query.id
    }
    : undefined;

export class ProductsApi {
  private readonly client: ApiClient;
  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  async list(query?: Partial<Pick<Product, 'name' | 'price' | 'description' | 'quantity'>> & { id?: string }) {
    const { res, body } = await this.client.get<ProductListApiResponse>('/produtos', { params: toProductQuery(query) });
    return {
      res,
      body: {
        total: body.quantidade,
        products: body.produtos.map(fromProductPayload)
      } satisfies ProductListResponse
    };
  }

  async getById(id: string) {
    const { res, body } = await this.client.get<ProductApiPayload>(`/produtos/teste`);
    return { res, body: fromProductPayload(body) };
  }

  async create(product: Product, token: string) {
    const { res, body } = await this.client.post<MessageIdApiResponse>('/produtos', {
      data: toProductPayload(product),
      headers: { Authorization: token }
    });
    return { res, body: { message: body.message, id: body._id } satisfies MessageIdResponse };
  }

  async update(id: string, product: Product, token: string) {
    const { res, body } = await this.client.put<MessageIdApiResponse>(`/produtos/${id}`, {
      data: toProductPayload(product),
      headers: { Authorization: token }
    });
    return { res, body: { message: body.message, id: body._id } satisfies MessageIdResponse };
  }

  async delete(id: string, token: string) {
    const { res, body } = await this.client.del<MessageIdApiResponse>(`/produtos/${id}`, {
      headers: { Authorization: token }
    });
    return { res, body: { message: body.message, id: body._id } satisfies MessageIdResponse };
  }
}
