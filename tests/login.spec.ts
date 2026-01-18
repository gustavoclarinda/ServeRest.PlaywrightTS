import { test, expect } from '@src/fixtures/apiFixtures';
import { LoginApi } from '@src/api/LoginApi';

test.describe('Login', () => {
  test('POST /login - should authenticate and return token', async ({ apiRequest, userCreds }) => {
    const login = new LoginApi(apiRequest);

    const { res, body } = await login.login(userCreds);

    expect(res.status(), await res.text()).toBe(200);
    expect(body.message).toBeTruthy();
    expect(body.authorization).toBeTruthy();
    // The token comes in "authorization" and must be sent in the Authorization header.
  });
});
