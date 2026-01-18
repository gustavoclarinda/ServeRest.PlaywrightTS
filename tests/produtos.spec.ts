import { test, expect } from '@src/fixtures/apiFixtures';
import { ProdutosApi, type Produto } from '@src/api/ProdutosApi';
import { randomString } from '@src/utils/random';

test.describe('Produtos', () => {
  test('CRUD básico de produto (admin)', async ({ apiRequest, adminToken }) => {
    const produtos = new ProdutosApi(apiRequest);

    const produtoBase: Produto = {
      nome: `Playwright ${randomString('produto')}`,
      preco: 1999,
      descricao: 'Produto criado via Playwright API tests',
      quantidade: 25
    };

    // CREATE
    const created = await produtos.criar(produtoBase, adminToken);
    expect(created.res.status(), await created.res.text()).toBe(201);
    expect(created.body._id).toBeTruthy();
    const id = created.body._id!;

    // READ by id
    const got = await produtos.buscarPorId(id);
    expect(got.res.status(), await got.res.text()).toBe(200);
    expect(got.body.nome).toBe(produtoBase.nome);

    // LIST (filter by id)
    const list = await produtos.listar({ _id: id });
    expect(list.res.status(), await list.res.text()).toBe(200);
    expect(list.body.quantidade).toBeGreaterThanOrEqual(1);
    expect(list.body.produtos.some(p => p._id === id)).toBeTruthy();

    // UPDATE
    const updatedPayload: Produto = { ...produtoBase, preco: 2499, quantidade: 10 };
    const updated = await produtos.atualizar(id, updatedPayload, adminToken);
    expect([200, 201]).toContain(updated.res.status());

    const got2 = await produtos.buscarPorId(id);
    expect(got2.res.status(), await got2.res.text()).toBe(200);
    expect(got2.body.preco).toBe(updatedPayload.preco);
    expect(got2.body.quantidade).toBe(updatedPayload.quantidade);

    // DELETE
    const del = await produtos.excluir(id, adminToken);
    expect(del.res.status()).toBe(200);
  });
});
