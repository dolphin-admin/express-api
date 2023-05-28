# EST

English / [简体中文](./README.zh-CN.md)

EST (Express Starter Template) is an opinionated `Express/TypeScript/Prisma/PostgreSQL` starter template.

## Feature

- [x] [Express](https://expressjs.com/), out of box
- [x] [TypeScript](https://www.typescriptlang.org/), of course
- [x] [Prisma](https://www.prisma.io/) for ORM
- [x] JWT authentication and role based authorization by custom middleware
- [ ] Fully configured logger with [Winston] and [Morgan]
- [ ] Unit, Integration and E2E tests with [Jest] and [Supertest]
- [x] Linting with `ESLint`
- [x] Formatting with `Prettier`
- [x] Code spell check
- [ ] Git hooks with `Husky` and `lint-staged`
- [ ] Containerised with `Docker` and `Docker Compose`
- [x] Path aliases support by using `@/*`

## Tech Stack

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

## Getting Started

## GitHub Template

> EST requires Node version >=14.16.0

[Create a repo from this template](https://github.com/recallwei/est/generate).

### Clone to Local

If you prefer to do it manually for a cleaner Git history, do the following:

```bash
npx degit recallwei/est my-est-app
cd my-est-app
pnpm i
```

## Checklist

When using this template, try to update your own information correctly according to the checklist:

- [ ] Change author name in `LICENSE`
- [ ] Change configuration in `package.json`
- [ ] Change environment variables in `.env`
- [ ] Clean up `README.md` and delete redundant `Controller`

## Usage

### Environment

- Node.js >=16.14.0
- pnpm
- PostgreSQL

### Config Environment Variables

Config `.env` file, refer to [.env.example](./.env.example).

### Install

```bash
pnpm i
```

### DB Migration

```bash
pnpm prisma:migrate
pnpm prisma:generate
```

### Start

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

## Known Issue

- [x] `chalk` v5.x doesn't work with `ts-node` well, use `chalk` v4.x instead.

## License

[MIT](/LICENSE) License &copy; 2023 [Bruce Song](https://github.com/recallwei)
