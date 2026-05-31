# Vercel 部署与 GitHub 登录

## 1. GitHub OAuth App

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Homepage URL: `https://guanxcode.vip`（本地开发可另建 App，回调填 `http://localhost:4321/auth/callback`）
3. Authorization callback URL: `https://guanxcode.vip/auth/callback`

## 2. Vercel

1. Import 本仓库，Framework Preset 选 **Astro**
2. 添加环境变量（与 `.env.example` 一致）：
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `SESSION_SECRET`（随机长字符串）
   - `ALLOWED_GITHUB_USERS`（如 `GuanXcode,other-user`）
3. 部署完成后，在 Vercel 绑定自定义域名 `guanxcode.vip`
4. 将域名 DNS 指向 Vercel（按控制台提示配置）

## 3. 白名单

`ALLOWED_GITHUB_USERS` 为逗号分隔的 GitHub **用户名**（login），不是邮箱。未列入的用户登录后会看到「不在白名单」提示。

## 4. 路由说明

| 路径 | 访问 |
|------|------|
| `/`, `/blog/*` | 公开 |
| `/login`, `/auth/*` | 认证流程 |
| `/me`, `/experience`, `/projects`, `/works` | 需登录且在白名单 |

## 5. 本地开发

```sh
cp .env.example .env
# 填写 OAuth 与 SESSION_SECRET
npm run dev
```

## 6. GitHub Pages

主站已改为 Vercel SSR，请停用 GitHub Pages 或避免与同一域名冲突。
