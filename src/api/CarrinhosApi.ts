import { ApiClient } from './ApiClient';
import type { APIRequestContext } from '@playwright/test';

export type CarrinhoItem = {
  idProduto: string;
  quantidade: number;
};

export type CarrinhoRequest = {
  produtos: CarrinhoItem[];
};

export type Carrinho = {
  produtos: Array<{ idProduto: string; quantidade: number; precoUnitario?: number }>;
  precoTotal?: number;
  quantidadeTotal?: number;
  idUsuario?: string;
  _id?: string;
};

export type ListaCarrinhosResponse = {
  quantidade: number;
  carrinhos: Carrinho[];
};

export type MensagemIdResponse = {
  message: string;
  _id?: string;
};

export class CarrinhosApi {
  private readonly client: ApiClient;
  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  listar() {
    return this.client.get<ListaCarrinhosResponse>('/carrinhos');
  }

  criar(carrinho: CarrinhoRequest, token: string) {
    return this.client.post<MensagemIdResponse>('/carrinhos', {
      data: carrinho,
      headers: { Authorization: token }
    });
  }

  concluirCompra(token: string) {
    // Endpoint citado em exemplos de testes/relatórios do ServeRest: DELETE /carrinhos/concluir-compra citeturn12search6
    return this.client.del<{ message: string }>('/carrinhos/concluir-compra', {
      headers: { Authorization: token }
    });
  }

  cancelarCompra(token: string) {
    // Endpoint mencionado na documentação pública: DELETE /carrinhos/cancelar-compra citeturn12search0turn12search3
    return this.client.del<{ message: string }>('/carrinhos/cancelar-compra', {
      headers: { Authorization: token }
    });
  }
}
