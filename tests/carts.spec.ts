import { test, expect } from '@src/fixtures/apiFixtures';
import { ProductsApi, type Product } from '@src/api/ProductsApi';
import { CartsApi } from '@src/api/CartsApi';
import { randomString } from '@src/utils/random';

test.describe('Carts', () => {
  test('Create cart and cancel purchase (regular user)', async ({ apiRequest, adminToken, userToken }) => {
    const products = new ProductsApi(apiRequest);
    const carts = new CartsApi(apiRequest);

    // Create a product with admin to ensure stock.
    const product: Product = {
      name: `CartItem ${randomString('p')}`,
      price: 123,
      description: 'Product for cart test',
      quantity: 5
    };

    const created = await products.create(product, adminToken);
    expect(created.res.status(), await created.res.text()).toBe(201);
    const productId = created.body.id!;

    // Create cart as a regular user.
    const cartCreate = await carts.create(
      {
        products: [{ productId, quantity: 1 }]
      },
      userToken
    );

    expect(cartCreate.res.status(), await cartCreate.res.text()).toBe(201);

    // Cancel the purchase (removes cart and restocks inventory).
    const cancel = await carts.cancel(userToken);
    expect(cancel.res.status(), await cancel.res.text()).toBe(200);
    expect(cancel.body.message).toBeTruthy();

    // Cleanup product.
    await products.delete(productId, adminToken);
  });

  test('Create cart and complete purchase (regular user)', async ({ apiRequest, adminToken, userToken }) => {
    const products = new ProductsApi(apiRequest);
    const carts = new CartsApi(apiRequest);

    const product: Product = {
      name: `CheckoutItem ${randomString('p')}`,
      price: 321,
      description: 'Product for checkout completion test',
      quantity: 3
    };

    const created = await products.create(product, adminToken);
    expect(created.res.status(), await created.res.text()).toBe(201);
    const productId = created.body.id!;

    const cartCreate = await carts.create(
      { products: [{ productId, quantity: 1 }] },
      userToken
    );
    expect(cartCreate.res.status(), await cartCreate.res.text()).toBe(201);

    const done = await carts.checkout(userToken);
    expect(done.res.status(), await done.res.text()).toBe(200);
    expect(done.body.message).toBeTruthy();

    // The product might have been decremented; remove from catalog regardless.
    await products.delete(productId, adminToken);
  });
});
