import { test, expect } from '@src/fixtures/apiFixtures';
import { ProductsApi, type Product } from '@src/api/ProductsApi';
import { randomString } from '@src/utils/random';

test.describe('Products', () => {
  test('Basic product CRUD (admin)', async ({ apiRequest, adminToken }) => {
    const products = new ProductsApi(apiRequest);

    const baseProduct: Product = {
      name: `Playwright ${randomString('product')}`,
      price: 1999,
      description: 'Product created via Playwright API tests',
      quantity: 25
    };

    // CREATE
    const created = await products.create(baseProduct, adminToken);
    expect(created.res.status(), await created.res.text()).toBe(201);
    expect(created.body.id).toBeTruthy();
    const id = created.body.id!;

    // READ by id
    const got = await products.getById(id);
    expect(got.res.status(), await got.res.text()).toBe(200);
    expect(got.body.name).toBe(baseProduct.name);

    // LIST (filter by id)
    const list = await products.list({ id });
    expect(list.res.status(), await list.res.text()).toBe(200);
    expect(list.body.total).toBeGreaterThanOrEqual(1);
    expect(list.body.products.some(p => p.id === id)).toBeTruthy();

    // UPDATE
    const updatedPayload: Product = { ...baseProduct, price: 2499, quantity: 10 };
    const updated = await products.update(id, updatedPayload, adminToken);
    expect([200, 201]).toContain(updated.res.status());

    const got2 = await products.getById(id);
    expect(got2.res.status(), await got2.res.text()).toBe(200);
    expect(got2.body.price).toBe(updatedPayload.price);
    expect(got2.body.quantity).toBe(updatedPayload.quantity);

    // DELETE
    const del = await products.delete(id, adminToken);
    expect(del.res.status()).toBe(200);
  });
});
