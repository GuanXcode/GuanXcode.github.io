# Astro 7 迁移清单

> 状态：**待办（已主动推迟）**  ｜  创建：2026-09-07
> 触发原因：`npm audit` 剩余 6 条漏洞全部只能通过本次迁移解决。
> 详见 `docs/security-audit-2026-09-07.md`。

## 一、为什么必须做

| 严重度 | 问题 | 需要的最低版本 |
|---|---|---|
| high | View Transitions 动画属性未转义 → 反射型 XSS | astro ≥ 7.0.10 |
| high | `transition:*` 指令值未转义 → XSS（仅影响 hydrate 的 island） | astro ≥ 7.0.4 |
| high | `sharp` 继承 libvips 漏洞（CVE-2026-33327/33328/35590/35591） | sharp ≥ 0.35（随 astro 7） |
| high | `@astrojs/vercel` ISR function 未授权路径覆盖 | adapter ≥ 11.0.3 |
| high | `path-to-regexp` 回溯正则 ReDoS（经 `@vercel/routing-utils` 引入） | adapter 11（routing-utils ^6.4.0） |
| low | `esbuild` Windows dev server 任意文件读取 | adapter 11（esbuild ^0.28.0） |

## 二、版本对照

| 包 | 当前 | 目标 | 备注 |
|---|---|---|---|
| `astro` | 6.4.8 | **^7.3.1** | |
| `@astrojs/vercel` | 10.0.8 | **^11.0.10** | peer 要求 `astro ^7.0.0` |
| `@astrojs/sitemap` | 3.7.4 | 3.7.4（保持） | 无 peer 约束 |
| `@astrojs/rss` | 4.0.19 | 4.0.19（保持） | |
| `@astrojs/check` | 0.9.10 | 0.9.10（保持） | |
| `@tailwindcss/vite` / `tailwindcss` | 4.2.2 | 4.2.2（保持） | peer 已支持 `vite ^8`，无需动 |

**铁律：`astro` 与 `@astrojs/vercel` 必须同升同降**，只升一个必然 ERESOLVE（见 2026-09-07 的构建失败）。

## 三、前置条件

1. **Node ≥ 22.12.0**（`astro@7` 的 `engines.node`）。本地与 Vercel 都要确认：
   - Vercel：Project Settings → Node.js Version 选 22.x（不能锁在 22.12 以下）
   - 本地：`node -v`
2. 仓库 `package.json` 里 `engines.node` 目前是 `22.x`，建议迁移时收紧为 `>=22.12.0`，避免 CI 装到 22.11。
3. 本地工作区干净，从 `master` 切分支。

## 四、执行步骤

```bash
git switch -c astro-7
npm install astro@^7 @astrojs/vercel@^11      # 必须一起装
npm run check                                  # 期望 0 errors
npm run build                                  # 期望 build Complete
npm run dev                                    # 人工过一遍页面
```

推分支 → Vercel 预览部署 → 逐项核对下方验证清单 → 合回 `master`。

## 五、本项目特有的风险点（按优先级）

### 1. Markdown 处理器默认切换 ★最高优先级
Astro 7 默认 Markdown 管道改为原生 `Sätteri`，**不再默认安装 `@astrojs/markdown-remark`**。

本项目重度依赖 Markdown：`src/content.config.ts` 里 5 个集合全部用 `glob()` 加载 `.md`
（blog / projects / experience / works / profile）。虽然没配 remark/rehype 插件，但**渲染细节可能变化**
（标点处理、标题锚点、代码块、表格等）。

处理方式二选一：
- **保持原样**：装回旧管道并显式指定
  ```bash
  npm install @astrojs/markdown-remark
  ```
  ```js
  // astro.config.mjs
  import { unified } from '@astrojs/markdown-remark';
  export default defineConfig({ markdown: { processor: unified() } });
  ```
- **接受新管道**：迁移前后各生成一次 `dist`，`diff` 关键页面 HTML 确认无视觉回归。

### 2. Rust 编译器对 HTML 更严格
Astro 7 默认且仅使用 Rust 编译器，**不再自动纠正无效 HTML 嵌套**（如 `<div>` 放在 `<p>` 内会被浏览器提前闭合）。
→ 重点看 `src/layouts/` 与首页卡片类组件的实际排版。

### 3. `compressHTML` 默认值变更
`true` → `'jsx'`，相邻内联元素间的空白会被剥离。→ 检查导航、标签云、行内图标的间距。

### 4. Vite 8
Astro 7 内部升到 Vite `^8.0.13`。`@tailwindcss/vite@4.2.2` 的 peer 已包含 `^8`，**理论上无冲突**；
若构建报 Tailwind 相关错，先升 `@tailwindcss/vite` + `tailwindcss` 到最新（当前 4.3.3）。

### 5. SSR / Vercel adapter 11
项目是 `output: 'server'` + `middleware.ts`（GitHub OAuth 白名单门禁，保护 `/me` 等路径）。
迁移后必须验证：登录态、cookie session、受保护路径跳转、ISR 行为。

## 六、验证清单

- [ ] `npm run check` → 0 errors
- [ ] `npm run build` → 成功，无新 warning
- [ ] 首页 / blog 列表 / 文章详情 / projects / works / experience 渲染正常
- [ ] Markdown 渲染与迁移前一致（重点：代码块、表格、脚注、标题锚点）
- [ ] 登录 → 访问受保护路径 → 刷新保持登录态 → 登出
- [ ] sitemap / RSS 输出正常（`sitemap-index.xml`、`rss.xml`）
- [ ] `npm audit` → 期望 **0 vulnerabilities**
- [ ] Vercel 预览部署成功且功能正常

## 七、回滚

```bash
git switch master && git branch -D astro-7    # 分支未合入前
# 若已合入并发现问题：
git revert -m 1 <merge-commit-sha>
```
依赖侧回滚：`git checkout <上个 commit> -- package.json package-lock.json && npm install`。

## 八、完成后的收尾

- `.github/dependabot.yml` 目前屏蔽了 `astro` 与 `@astrojs/*` 的 semver-major 自动升级。
  迁移完成后规则依然有效，**不需要改**——大版本升级本来就该人工做。
- 删除本文件（或改为记录迁移结果的复盘）。

## 参考

- Astro v7 升级指南：https://docs.astro.build/en/guides/upgrade-to/v7/
- Vercel adapter：https://docs.astro.build/en/guides/deploy/vercel/
