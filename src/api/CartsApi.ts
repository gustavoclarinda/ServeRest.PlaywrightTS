import { ApiClient } from './ApiClient';
import type { APIRequestContext } from '@playwright/test';

type CartItemApiPayload = {
  idProduto: string;
  quantidade: number;
};

type CartApiRequest = {
  produtos: CartItemApiPayload[];
};

type CartApiPayload = {
  produtos: Array<{ idProduto: string; quantidade: number; precoUnitario?: number }>;
  precoTotal?: number;
  quantidadeTotal?: number;
  idUsuario?: string;
  _id?: string;
};

type CartListApiResponse = {
  quantidade: number;
  carrinhos: CartApiPayload[];
};

type MessageIdApiResponse = {
  message: string;
  _id?: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CartRequest = {
  products: CartItem[];
};

export type Cart = {
  products: Array<{ productId: string; quantity: number; unitPrice?: number }>;
  totalPrice?: number;
  totalQuantity?: number;
  userId?: string;
  id?: string;
};

export type CartListResponse = {
  total: number;
  carts: Cart[];
};

export type MessageIdResponse = {
  message: string;
  id?: string;
};

const toCartRequestPayload = (cart: CartRequest): CartApiRequest => ({
  produtos: cart.products.map(item => ({ idProduto: item.productId, quantidade: item.quantity }))
});

const fromCartPayload = (cart: CartApiPayload): Cart => ({
  products: cart.produtos.map(item => ({
    productId: item.idProduto,
    quantity: item.quantidade,
    unitPrice: item.precoUnitario
  })),
  totalPrice: cart.precoTotal,
  totalQuantity: cart.quantidadeTotal,
  userId: cart.idUsuario,
  id: cart._id
});

export class CartsApi {
  private readonly client: ApiClient;
  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  async list() {
    const { res, body } = await this.client.get<CartListApiResponse>('/carrinhos');
    return {
      res,
      body: {
        total: body.quantidade,
        carts: body.carrinhos.map(fromCartPayload)
      } satisfies CartListResponse
    };
  }

  async create(cart: CartRequest, token: string) {
    const { res, body } = await this.client.post<MessageIdApiResponse>('/carrinhos', {
      data: toCartRequestPayload(cart),
      headers: { Authorization: token }
    });
    return { res, body: { message: body.message, id: body._id } satisfies MessageIdResponse };
  }

  async checkout(token: string) {
    return this.client.del<{ message: string }>('/carrinhos/concluir-compra', {
      headers: { Authorization: token }
    });
  }

  async cancel(token: string) {
    return this.client.del<{ message: string }>('/carrinhos/cancelar-compra', {
      headers: { Authorization: token }
    });
  }
}
