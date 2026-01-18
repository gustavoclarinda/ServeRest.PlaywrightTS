import { ApiClient } from './ApiClient';
import type { APIRequestContext } from '@playwright/test';

export type Produto = {
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
  _id?: string;
};

export type ListaProdutosResponse = {
  quantidade: number;
  produtos: Produto[];
};

export type MensagemIdResponse = {
  message: string;
  _id?: string;
};

export class ProdutosApi {
  private readonly client: ApiClient;
  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  listar(query?: Partial<Pick<Produto, 'nome' | 'preco' | 'descricao' | 'quantidade'>> & { _id?: string }) {
    return this.client.get<ListaProdutosResponse>('/produtos', { params: query });
  }

  buscarPorId(id: string) {
    return this.client.get<Produto>(`/produtos/${id}`);
  }

  criar(produto: Produto, token: string) {
    return this.client.post<MensagemIdResponse>('/produtos', {
      data: produto,
      headers: { Authorization: token }
    });
  }

  atualizar(id: string, produto: Produto, token: string) {
    return this.client.put<MensagemIdResponse>(`/produtos/${id}`, {
      data: produto,
      headers: { Authorization: token }
    });
  }

  excluir(id: string, token: string) {
    return this.client.del<MensagemIdResponse>(`/produtos/${id}`, {
      headers: { Authorization: token }
    });
  }
}
