# Dolphin Admin Server

[English](./README.md) / 简体中文

Dolphin Admin Server 是 Dolphin Admin Web 的后端服务，基于 Express + TypeScript + Prisma + PostgresSQL，通过
[EST](https://github.com/recallwei/est) 模板构建。

## 特性

- [x] 基于 [Express](https://expressjs.com/) 构建 Web 服务
- [x] [TypeScript](https://www.typescriptlang.org/)，当然
- [x] [Prisma](https://www.prisma.io/) 作为 ORM
- [x] 基于装饰器构建路由、中间件、异常处理等
- [x] JWT 认证和基于角色的授权
- [x] 使用 [multer](https://github.com/expressjs/multer) 构建文件服务
- [x] 使用 [Socket.IO](https://socket.io/zh-CN/) 进行实时通信
- [x] 使用 [ESLint](https://eslint.org/) 执行代码检查
- [x] 使用 [Prettier](https://prettier.io/) 执行代码格式化
- [x] 使用 [CSpell](https://cspell.org/) 执行代码拼写检查
- [x] 使用 [Husky](https://typicode.github.io/husky/)，[lint-staged](https://github.com/okonet/lint-staged),
      [commitlint](https://commitlint.js.org/#/), [cz-git](https://cz-git.qbb.sh/) 进行 Git 提交管理
- [x] 支持绝对路径引入，使用 `@/*`

## TODO

- [ ] 使用 [Docker](https://www.docker.com/) 和 [Docker Compose](https://docs.docker.com/compose/) 进行容器化

## 技术栈

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

## 代码规范

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [内部开发规范](./docs/dev-standard.md)

## 使用

### 环境

- Node.js >=16.14.0
- pnpm
- PostgreSQL

### 配置环境变量

配置 `.env` 文件，参考 [.env.example](./.env.example).

### 安装

```bash
pnpm i
```

### 数据库迁移

```bash
pnpm prisma:migrate
pnpm prisma:generate
```

### 启动

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

## 许可证

[MIT](/LICENSE) License &copy; 2023 [Bruce Song](https://github.com/recallwei) from [Bit Ocean](https://github.com/bit-ocean-studio)
