# 依赖安全审计 — 2026-09-07

基线：`package-lock.json`（Astro 6.3.3 + @astrojs/vercel 10.0.8），执行 `npm audit`。

## 结果概览

| 阶段 | critical | high | moderate | low | 合计 |
|---|---|---|---|---|---|
| 修复前 | 1 | 12 | 5 | 1 | **19** |
| 修复后（`npm audit fix`，无大版本变更） | 0 | 5 | 0 | 1 | **6** |

> 口径说明：GitHub 页面提示的 41 个漏洞是**按 advisory 条数**统计（一个包命中多条 advisory 会重复计数，
> 例如 `tar` 单包就命中 6 条）；`npm audit` 的 19 是**按包**统计，两者不矛盾。

## 本次已修复（13 个包，全部为 minor/patch，无破坏性）

| 包 | 变更 | 修复的问题 |
|---|---|---|
| `astro` | 6.3.3 → **6.4.8** | XSS（spread props 属性名未转义）、预渲染错误页 Host 头 SSRF（high） |
| `@astrojs/rss` | 4.0.18 → **4.0.19** | RSS 字段未转义导致 XML 注入 |
| `tar` | 7.5.15 → **7.5.22** | **critical**：解压 DoS / PAX 头解析差异导致文件走私，另含 5 条 DoS |
| `vite` | 7.3.2 → **7.3.6** | `server.fs.deny` Windows 备用路径绕过（high）、launch-editor NTLMv2 哈希泄露 |
| `postcss` | 8.5.14 → **8.5.28** | sourceMappingURL 路径穿越读取任意 `.map` 文件 |
| `nanoid` | 3.3.11 → **3.3.18** | 非安全生成器 size 为 0/负数时死循环、整数溢出 |
| `js-yaml` | 4.1.1 → **4.3.2** | merge key 二次复杂度 DoS（CPU 耗尽） |
| `fast-uri` | 3.1.2 → **3.1.7** | 反斜杠 authority / IPv6 规范化 / 百分号解码导致 host 混淆与 SSRF |
| `brace-expansion` | 5.0.6 → **5.0.9** | 连续 `{}` 指数级展开 DoS、展开长度无上限导致 OOM |
| `svgo` | 4.0.1 → **4.1.0** | removeScripts 插件残留可执行脚本 |
| `yaml-language-server` 链（`volar-service-*`、`yaml`） | — | 深度嵌套 YAML 导致栈溢出 |
| 其他 | `prettier`、`sax`、`css-select`、`css-what`、`remark-smartypants`、`@astrojs/*` 子包 | 传递依赖同步升级 |

验证：`npm run check` → 0 errors / 0 warnings（5 hints，升级前已存在）；`npm run build` → 成功。

## 剩余 6 条：全部需要 Astro 7 大版本迁移

| 包 | 严重度 | 问题 | 修复版本 |
|---|---|---|---|
| `astro` | high | View Transitions 动画属性未转义导致反射型 XSS；`transition:*` 指令值未转义 XSS | ≥ **7.0.10** |
| `astro` → `esbuild` | low | Windows 上 dev server 任意文件读取 | 随 astro 7 |
| `astro` → `sharp` | high | libvips 继承漏洞（CVE-2026-33327/33328/35590/35591） | 随 astro 7（sharp ≥ 0.35） |
| `@astrojs/vercel` | high | ISR function 未授权路径覆盖（≥10.0.3 <11.0.3） | ≥ **11.0.3**（当前最新 11.0.10） |
| `@astrojs/vercel` → `@vercel/routing-utils` → `path-to-regexp` | high | 生成回溯正则，ReDoS | 随 adapter 11 |

**结论**：剩下这批只能靠 Astro 6 → 7 迁移解决，且 `astro` 与 `@astrojs/vercel` 必须同时升（adapter 11 的 peer 要求 astro ^7）。
迁移前需确认 Node ≥ 22.12.0（`astro@7` 的 engines 要求）。

## 关联配置

`.github/dependabot.yml`（2026-09-07 新增）已屏蔽 `astro` 与 `@astrojs/*` 的 semver-major 自动升级，
避免 Dependabot 再次提出"只升 adapter 不升框架"这类必然 ERESOLVE 的 PR。minor/patch 安全更新仍会自动提。
