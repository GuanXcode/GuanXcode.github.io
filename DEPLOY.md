# Vercel 部署与 GitHub 登录

完整站点规划见 [docs/SITE-PLAN.md](./docs/SITE-PLAN.md)。

## 1. GitHub OAuth App

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Homepage URL: `https://guanxcode.vip`（本地开发可另建 App，回调填 `http://localhost:4321/auth/callback`）
3. Authorization callback URL（生产 + 预览各加一条）：
   - `https://guanxcode.vip/auth/callback`
   - `https://<your-project>.vercel.app/auth/callback`

## 2. Vercel

1. Import 本仓库，Framework Preset 选 **Astro**
2. Production 分支建议 **`master`**
3. 添加环境变量（与 `.env.example` 一致）：
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `SESSION_SECRET`（随机长字符串）
   - `ALLOWED_GITHUB_USERS`（如 `GuanXcode,other-user`）
4. 部署完成后绑定自定义域名 `guanxcode.vip`，DNS 指向 Vercel
5. **Promote to Production**：Preview 部署不会自动成为生产，需在 Deployments 中 Promote

## 3. 白名单

`ALLOWED_GITHUB_USERS` 为逗号分隔的 GitHub **用户名**（login），不是邮箱。

## 4. 路由与访问

| 路径 | 未登录 | 登录（白名单） |
|------|--------|----------------|
| `/`, `/blog/*` | ✅ | ✅ |
| `/works` | ✅ 仅 `visibility: public` | ✅ 全部 |
| `/works/:slug` | ✅ 若该条 public | ✅ 全部 |
| `/login`, `/auth/*` | 认证流程 | 认证流程 |
| `/me`, `/experience`, `/projects` | ❌ → `/login` | ✅ |

## 5. 本地开发

```sh
cp .env.example .env
npm run dev
```

## 6. GitHub Pages

`guanxcode.vip` 已指向 **Vercel**（`Server: Vercel`）。建议在 GitHub 仓库 **Settings → Pages** 中停用 Pages，并可禁用 `.github/workflows/deploy.yml`，避免误部署旧静态站。

## 7. 内容维护

- 经历：`src/content/experience/*.md`
- 项目（摘要级）：`src/content/projects/*.md` — 使用 `description` + `designBrief`
- 作品：`src/content/works/*.md` — 设置 `visibility: public | private`
- 公开 About：`src/content/profile/site.md`

Markdown 模板见 `docs/SITE-PLAN.md` §11。
