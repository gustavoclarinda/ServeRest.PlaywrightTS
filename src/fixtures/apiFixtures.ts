import { test as base, request as playwrightRequest } from '@playwright/test';
import { LoginApi } from '@src/api/LoginApi';
import { UsersApi } from '@src/api/UsersApi';
import { randomEmail, randomString } from '@src/utils/random';

type Creds = { email: string; password: string };

type Fixtures = {
  apiRequest: import('@playwright/test').APIRequestContext;
  adminCreds: Creds;
  userCreds: Creds;
  adminToken: string;
  userToken: string;
};

export const test = base.extend<Fixtures>({
  apiRequest: async ({ baseURL }, use) => {
    const ctx = await playwrightRequest.newContext({
      baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json'
      }
    });
    await use(ctx);
    await ctx.dispose();
  },

  adminCreds: async ({ apiRequest }, use) => {
    // Prefer env-provided credentials, otherwise create a temporary admin user.
    const email = process.env.ADMIN_EMAIL?.trim();
    const password = process.env.ADMIN_PASSWORD?.trim();

    if (email && password) {
      await use({ email, password });
      return;
    }

    const users = new UsersApi(apiRequest);
    const tempEmail = randomEmail();
    const tempPass = `pw-${randomString('adm', 10)}`;

    await users.create({
      name: `Admin ${randomString('sr')}`,
      email: tempEmail,
      password: tempPass,
      isAdmin: true
    });

    await use({ email: tempEmail, password: tempPass });
  },

  userCreds: async ({ apiRequest }, use) => {
    // Prefer env-provided credentials, otherwise create a temporary regular user.
    const email = process.env.USER_EMAIL?.trim();
    const password = process.env.USER_PASSWORD?.trim();

    if (email && password) {
      await use({ email, password });
      return;
    }

    const users = new UsersApi(apiRequest);
    const tempEmail = randomEmail();
    const tempPass = `pw-${randomString('usr', 10)}`;

    await users.create({
      name: `User ${randomString('sr')}`,
      email: tempEmail,
      password: tempPass,
      isAdmin: false
    });

    await use({ email: tempEmail, password: tempPass });
  },

  adminToken: async ({ apiRequest, adminCreds }, use) => {
    const login = new LoginApi(apiRequest);
    const { res, body } = await login.login(adminCreds);
    if (!res.ok()) throw new Error(`Admin login failed: ${res.status()} ${JSON.stringify(body)}`);
    await use(body.authorization);
  },

  userToken: async ({ apiRequest, userCreds }, use) => {
    const login = new LoginApi(apiRequest);
    const { res, body } = await login.login(userCreds);
    if (!res.ok()) throw new Error(`User login failed: ${res.status()} ${JSON.stringify(body)}`);
    await use(body.authorization);
  }
});

export const expect = test.expect;
