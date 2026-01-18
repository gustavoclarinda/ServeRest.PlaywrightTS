import { test, expect } from '@src/fixtures/apiFixtures';
import { ProdutosApi, type Produto } from '@src/api/ProdutosApi';
import { CarrinhosApi } from '@src/api/CarrinhosApi';
import { randomString } from '@src/utils/random';

test.describe('Carrinhos', () => {
  test('Criar carrinho e cancelar compra (usuário comum)', async ({ apiRequest, adminToken, userToken }) => {
    const produtos = new ProdutosApi(apiRequest);
    const carrinhos = new CarrinhosApi(apiRequest);

    // Cria um produto com admin para garantir estoque
    const produto: Produto = {
      nome: `CartItem ${randomString('p')}`,
      preco: 123,
      descricao: 'Produto para teste de carrinho',
      quantidade: 5
    };

    const created = await produtos.criar(produto, adminToken);
    expect(created.res.status(), await created.res.text()).toBe(201);
    const produtoId = created.body._id!;

    // Cria carrinho como usuário comum
    const cartCreate = await carrinhos.criar(
      {
        produtos: [{ idProduto: produtoId, quantidade: 1 }]
      },
      userToken
    );

    expect(cartCreate.res.status(), await cartCreate.res.text()).toBe(201);

    // Cancela a compra (exclui carrinho e reabastece estoque)
    const cancel = await carrinhos.cancelarCompra(userToken);
    expect(cancel.res.status(), await cancel.res.text()).toBe(200);
    expect(cancel.body.message).toBeTruthy();

    // Cleanup do produto
    await produtos.excluir(produtoId, adminToken);
  });

  test('Criar carrinho e concluir compra (usuário comum)', async ({ apiRequest, adminToken, userToken }) => {
    const produtos = new ProdutosApi(apiRequest);
    const carrinhos = new CarrinhosApi(apiRequest);

    const produto: Produto = {
      nome: `CheckoutItem ${randomString('p')}`,
      preco: 321,
      descricao: 'Produto para teste de concluir compra',
      quantidade: 3
    };

    const created = await produtos.criar(produto, adminToken);
    expect(created.res.status(), await created.res.text()).toBe(201);
    const produtoId = created.body._id!;

    const cartCreate = await carrinhos.criar(
      { produtos: [{ idProduto: produtoId, quantidade: 1 }] },
      userToken
    );
    expect(cartCreate.res.status(), await cartCreate.res.text()).toBe(201);

    const done = await carrinhos.concluirCompra(userToken);
    expect(done.res.status(), await done.res.text()).toBe(200);
    expect(done.body.message).toBeTruthy();

    // Produto pode ter sido decrementado; removemos do catálogo de qualquer forma.
    await produtos.excluir(produtoId, adminToken);
  });
});
