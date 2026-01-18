# ServeRest API – Playwright + TypeScript (Page Objects)

API test automation project using **Playwright Test + TypeScript**, targeting the **ServeRest** API (https://serverest.dev/).

## What’s included

- Tests for the endpoints:
  - **Login** (`POST /login`)
  - **Products** (`/produtos`)
  - **Carts** (`/carrinhos`, `DELETE /carrinhos/concluir-compra`, `DELETE /carrinhos/cancelar-compra`)
- **Page Object** architecture (API context: *API Page Objects / API clients*) with code reuse.
- Fixtures for authentication (token) and request context.

> Important note: To reliably create products and carts in a shared environment, this project creates temporary users via `POST /usuarios` when you do not define credentials in `.env`. This avoids relying on accounts that may be changed or deleted by others.

## Prerequisites

- Node.js 18+ (20+ recommended)

## How to run

1) Install dependencies:

```bash
npm install
npx playwright install
```

2) (Optional) Configure `.env` (use `.env.example` as a base)

3) Run the tests:

```bash
npm test
```

4) HTML report:

```bash
npm run report
```

## Open in Visual Studio

This repository is a standard Node/TS project. You can:

- Open in **Visual Studio Code**: `File > Open Folder...`
- Open in **Visual Studio 2022** (with Node.js workload): `File > Open > Folder...`

## Structure

```
src/
  api/
    ApiClient.ts
    LoginApi.ts
    ProductsApi.ts
    CartsApi.ts
    UsersApi.ts
  fixtures/
    apiFixtures.ts
  utils/
    random.ts
tests/
  login.spec.ts
  products.spec.ts
  carts.spec.ts
```
