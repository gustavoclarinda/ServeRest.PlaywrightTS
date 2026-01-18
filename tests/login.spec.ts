import { test, expect } from '@src/fixtures/apiFixtures';
import { LoginApi } from '@src/api/LoginApi';

test.describe('Login', () => {
  test('POST /login - deve autenticar e retornar token', async ({ apiRequest, userCreds }) => {
    const login = new LoginApi(apiRequest);

    const { res, body } = await login.login(userCreds);

    expect(res.status(), await res.text()).toBe(200);
    expect(body.message).toBeTruthy();
    expect(body.authorization).toBeTruthy();
    // A doc menciona que o token vem em "authorization" e deve ser enviado no header Authorization. citeturn10view0
  });
});
