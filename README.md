# Dolphin Admin Server

English / [简体中文](./README.zh-CN.md)

Dolphin Admin Server is the backend service of Dolphin Admin Web, based on Express + TypeScript + Prisma + PostgresSQL,
built with [EST](https://github.com/recallwei/est).

## Feature

- [x] Build Web service based on [Express](https://expressjs.com/)
- [x] [TypeScript](https://www.typescriptlang.org/), of course
- [x] [Prisma](https://www.prisma.io/) as ORM
- [x] Build routes, middleware, exception handling, etc. based on decorators
- [x] JWT authentication and role-based authorization
- [x] Build file service based on [multer](https://github.com/expressjs/multer)
- [x] Real-time communication using [Socket.IO](https://socket.io/)
- [x] Code check with [ESLint](https://eslint.org/)
- [x] Code formatting with [Prettier](https://prettier.io/)
- [x] Code spelling check with [CSpell](https://cspell.org/)
- [x] Git commit management with [Husky](https://typicode.github.io/husky/),
      [lint-staged](https://github.com/okonet/lint-staged), [commitlint](https://commitlint.js.org/#/), [cz-git](https://cz-git.qbb.sh/)
- [x] Support absolute path import, use `@/*`

## TODO

- [ ] Containerization with [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Tech Stack

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

## Code Style

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Dev Standard](./docs/dev-standard.md)

## Usage

### Environment

- Node.js >=16.14.0
- pnpm
- PostgreSQL

### Configuration Environment Variables

Configure `.env` file, refer to [.env.example](./.env.example).

### Install

```bash
pnpm i
```

### Database Migration

```bash
pnpm run migrate:dev
pnpm prisma:generate
```

### Run

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

## License

[MIT](/LICENSE) License &copy; 2023 [Bruce Song](https://github.com/recallwei) from [Bit Ocean](https://github.com/bit-ocean-studio)
