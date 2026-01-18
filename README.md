# ServeRest API – Playwright + TypeScript (Page Objects)

Projeto de automação de testes **API** usando **Playwright Test + TypeScript**, apontando para a API do **ServeRest** (https://serverest.dev/).

## O que tem aqui

- Testes para os endpoints:
  - **Login** (`POST /login`)
  - **Produtos** (`/produtos`)
  - **Carrinhos** (`/carrinhos`, `DELETE /carrinhos/concluir-compra`, `DELETE /carrinhos/cancelar-compra`)
- Arquitetura com **Page Objects** (aqui no contexto de API: *API Page Objects / API clients*) e reaproveitamento de código.
- Fixtures para autenticação (token) e contexto de request.

> Observação importante: Para conseguir criar produtos e carrinhos de forma confiável em um ambiente compartilhado, este projeto cria usuários temporários via `POST /usuarios` quando você não define credenciais no `.env`. Isso evita depender de contas que podem ser alteradas/deletadas por terceiros.

## Pré‑requisitos

- Node.js 18+ (recomendado 20+)

## Como rodar

1) Instale dependências:

```bash
npm install
npx playwright install
```

2) (Opcional) Configure `.env` (use `.env.example` como base)

3) Execute os testes:

```bash
npm test
```

4) Report HTML:

```bash
npm run report
```

## Abrir no Visual Studio

Este repositório é um projeto Node/TS padrão. Você pode:

- Abrir no **Visual Studio Code**: `File > Open Folder...`
- Abrir no **Visual Studio 2022** (com workload Node.js): `File > Open > Folder...`

## Estrutura

```
src/
  api/
    ApiClient.ts
    LoginApi.ts
    ProdutosApi.ts
    CarrinhosApi.ts
    UsuariosApi.ts
  fixtures/
    apiFixtures.ts
  utils/
    random.ts
tests/
  login.spec.ts
  produtos.spec.ts
  carrinho.spec.ts
```

## Referências

- Documentação/Swagger do ServeRest menciona os endpoints e a autenticação via header `Authorization`. citeturn10view0
- Site do ServeRest: https://serverest.dev citeturn12search0
