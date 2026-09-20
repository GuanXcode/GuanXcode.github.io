# Astro 7 迁移复盘

> 状态：**已完成（本地）**  ｜  实施：2026-09-20 ｜ 分支：`astro-7`  
> 触发原因：`npm audit` 剩余漏洞只能靠 Astro 6 → 7 解决。详见 `docs/security-audit-2026-09-07.md`。

## 结果

| 项 | 结果 |
|---|---|
| `astro` | 6.4.8 → **7.3.3** |
| `@astrojs/vercel` | 10.0.8 → **11.0.10** |
| Node engines | `22.x` → **`>=22.12.0`** |
| `npm run check` | 0 errors（5 hints，升级前已存在） |
| `npm run build` | 成功，`@astrojs/vercel` 完成 function bundle + sitemap |
| `npm audit` | **0 vulnerabilities** |
| Markdown | 接受默认 **Sätteri** 管道（无 remark/rehype 插件） |
| 本地页面 | 首页 / 博客列表 / 文章详情 / 作品 / 登录正常；`/me` `/projects` `/experience` 仍 302 到 `/login` |

## 额外处理

`@vercel/routing-utils@6.6.0` 仍声明 `path-to-regexp@6.1.0`（GHSA-9wv6-86v2-598j）。adapter 11 并未真正消掉这条传递依赖。

在 `package.json` 加了 override，钉到已修补的 `6.3.0`：

```json
"overrides": {
  "path-to-regexp": "6.3.0"
}
```

`npm audit fix --force` 会把 adapter **降回 8.x**，不要用。

## 已知限制

- `@astrojs/vercel` **不支持** `astro preview`。本地用 `npm run dev`。
- 仓库仍有 GitHub Pages workflow；生产目标是 Vercel SSR，Pages 构建产物不适用。
- 源码没有 `rss.xml` 路由（`@astrojs/rss` 已装未接线），与本次迁移无关。
- OAuth 登录闭环未在本地完整走（无 `.env`）；门禁重定向已验证。

## 未改动的行为选择

- 未装回 `@astrojs/markdown-remark`（无自定义 remark 插件）。
- 未改 `compressHTML`（默认 `'jsx'`）。中文站点 + flex `gap` / 标签 pill，首页与博客未见空白塌缩。
- Dependabot 仍屏蔽 `astro` / `@astrojs/*` 的 semver-major，保持人工升级。

## 上线前

1. Vercel Node 选 **22.x**（须 ≥ 22.12）。
2. Preview 部署后走一遍：登录 → `/me` → 刷新保持 session → 登出。
3. 合入 `master` 后再 Promote 生产。
