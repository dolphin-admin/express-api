# EST

[English](./README.md) / 简体中文

EST (Express Starter Template) 是一个基于 `Express/TypeScript/Prisma/PostgreSQL` 的模板项目。

## 特性

- [x] [Express](https://expressjs.com/)，开箱即用
- [x] [TypeScript](https://www.typescriptlang.org/)，当然
- [x] [Prisma](https://www.prisma.io/) 作为 ORM
- [x] JWT 认证和基于角色的授权
- [ ] 配置完善的日志系统，使用 [Winston] 和 [Morgan]
- [ ] 使用 [Jest] 和 [Supertest] 进行单元测试、集成测试和 E2E 测试
- [x] 使用 `ESLint` 进行代码检查
- [x] 使用 `Prettier` 进行代码格式化
- [x] 代码拼写检查
- [ ] 使用 `Husky` 和 `lint-staged` 进行 Git 钩子管理
- [ ] 使用 `Docker` 和 `Docker Compose` 进行容器化
- [x] 使用 `@/*` 作为路径别名

## 技术栈

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

## 开始使用

### GitHub 模板

> EST 需要 Node 版本 >=14.16.0

[使用这个模板创建仓库](https://github.com/recallwei/est/generate)。

### 克隆到本地

如果您更喜欢使用更干净的 Git 历史记录手动执行此操作：

```bash
npx degit recallwei/est my-est-app
cd my-est-app
pnpm i
```

## 清单

使用此模板时，请尝试按照清单正确更新您自己的信息：

- [ ] 在 `LICENSE` 中改变作者名
- [ ] 在 `package.json` 中改变配置
- [ ] 在 `.env` 中修改环境变量
- [ ] 整理 `README.md]` 并删除冗余的 `Controller`

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

## 已知问题

- [x] `chalk` v5.x 与 `ts-node` 不兼容，使用 `chalk` v4.x 代替。

## 许可证

[MIT](/LICENSE) License &copy; 2023 [Bruce Song](https://github.com/recallwei)
