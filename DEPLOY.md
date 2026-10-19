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
2. Production 分支必须设为 **`master`**（其他分支只出 Preview，不会成为生产 —— 见 §3）
3. 添加环境变量（与 `.env.example` 一致）：
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `SESSION_SECRET`（随机长字符串）
   - `ALLOWED_GITHUB_USERS`（如 `GuanXcode,other-user`）
4. 部署完成后绑定自定义域名 `guanxcode.vip`，DNS 指向 Vercel
5. **Promote to Production**：Preview 部署不会自动成为生产，需在 Deployments 中 Promote

## 3. 分支与发布流程

| 分支 | 角色 | 部署结果 |
|------|------|----------|
| `astro-7` | 日常开发分支 | 只出 **Preview** |
| `master` | 发布分支 | **生产部署** |

**代码提交并经 review 通过后，必须把 `astro-7` 合并进 `master` —— 只推 `astro-7` 不会让改动上线。**

```sh
git checkout master
git pull origin master
git merge origin/astro-7      # 无法 fast-forward，见下方注意 2
git push origin master        # push 之后才触发生产部署
```

注意：

1. **只推 `astro-7` 不会上线**：Preview 部署不覆盖生产，也不要依赖"Promote to Production"来发布。
2. **两分支之间无法 fast-forward**：`master` 上保留了历次 `Merge pull request #nn from GuanXcode/astro-7` 的 merge commit，所以必须执行真正的 `git merge`（会产生新的 merge commit）。
3. **CI 两边都会跑**：`.github/workflows/ci.yml` 监听 `master` 与 `astro-7`，各自执行 `astro check` + `astro build`。合并后请确认 `master` 上的 CI 为绿。
4. 合并前确认 `astro-7` 已 push，且与 `origin/astro-7` 同步。

## 4. 白名单

`ALLOWED_GITHUB_USERS` 为逗号分隔的 GitHub **用户名**（login），不是邮箱。

## 5. 路由与访问

| 路径 | 未登录 | 登录（白名单） |
|------|--------|----------------|
| `/`, `/blog/*` | ✅ | ✅ |
| `/works` | ✅ 仅 `visibility: public` | ✅ 全部 |
| `/works/:slug` | ✅ 若该条 public | ✅ 全部 |
| `/login`, `/auth/*` | 认证流程 | 认证流程 |
| `/me`, `/experience`, `/projects` | ❌ → `/login` | ✅ |

## 6. 本地开发

```sh
cp .env.example .env
npm run dev
```

## 7. GitHub Pages

`guanxcode.vip` 已指向 **Vercel**（`Server: Vercel`）。建议在 GitHub 仓库 **Settings → Pages** 中停用 Pages，并可禁用 `.github/workflows/deploy.yml`，避免误部署旧静态站。

## 8. 内容维护

- 经历：`src/content/experience/*.md`
- 项目（摘要级）：`src/content/projects/*.md` — 使用 `description` + `designBrief`
- 作品：`src/content/works/*.md` — 设置 `visibility: public | private`
- 公开 About：`src/content/profile/site.md`

Markdown 模板见 `docs/SITE-PLAN.md` §11。
