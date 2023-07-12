# Dolphin Admin Server

Dolphin Admin Server 是 DoDolphinlpin Admin Web 的后端服务，基于 `Express/TypeScript/Prisma/PostgreSQL`，
通过 [EST](https://github.com/recallwei/est) 模板构建。

## 特性

- [x] 基于 [Express](https://expressjs.com/) 构建 Web 服务
- [x] [TypeScript](https://www.typescriptlang.org/)，当然
- [x] [Prisma](https://www.prisma.io/) 作为 ORM
- [x] JWT 认证和基于角色的授权
- [x] 使用 `multer` 构建文件服务
- [x] 使用 `socket.io` 构建 WebSocket 服务
- [x] 使用 `ESLint` 执行代码检查
- [x] 使用 `Prettier` 执行代码格式化
- [x] 使用 `cspell` 执行代码拼写检查
- [x] 使用 `Husky`，`lint-staged` 和 `commitlint` 进行 Git 提交管理
- [x] 使用 `@/*` 作为绝对路径

## 技术栈

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

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

[MIT](/LICENSE) License &copy; 2023 [Bruce Song](https://github.com/recallwei)
