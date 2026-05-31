# 站点规划：个人履历与作品窗口

> **状态：** 规划中 · 最后更新：2026-05-31（已同步产品决策 v2）  
> **关联实现：** Vercel SSR + GitHub OAuth 白名单（技术骨架已有，内容与 IA 按本文档迭代）

---

## 1. 核心目标（North Star）

**将本站改造为：以职业经历、项目概要、个人作品为核心的个人介绍窗口。**

- **职业经历**：GitHub 登录 + 白名单，方可查看。
- **项目**：登录后可见；**仅展示总结与设计方案简述**，不写实现细节与敏感业务信息。
- **作品**：**可部分公开**（无需登录）；其余作品登录后可见。
- **博客**：**全部公开**（现有文章公开可见）。

### 成功标准

| 维度 | 标准 |
|------|------|
| 身份 | 公开层仅传达专业方向，不含敏感信息 |
| 经历 | 授权访客可阅读完整时间线与职责成果 |
| 项目 | 授权访客可了解「做了什么、方案思路」，深度控制在摘要级 |
| 作品 | 陌生人可看精选公开作品；授权访客可看全部 |
| 安全 | 经历与项目详情不对未授权用户开放 |
| 体验 | HR 登录后 3 分钟内建立整体认知 |

### 已确认决策（2026-05-31）

| # | 议题 | 决定 |
|---|------|------|
| 1 | 博客 | **全部公开**（现有文章均公开可见） |
| 2 | 公开 About | **只写专业方向**，不写任何敏感信息 |
| 3 | 项目 vs 作品 | **§2.4** |
| 4 | 界面用词 | **B — 混合**（主标题直白，科幻词作副标题） |
| 5 | Phase 1 | **已启动**（2026-05-31） |

- **部署：** Vercel（Hobby）
- **认证：** GitHub OAuth + 服务端 Session
- **授权：** 白名单（`ALLOWED_GITHUB_USERS`）

---

## 2. 站点定位

### 2.1 不是什么

- 不是项目深度复盘站（项目只到「总结 + 方案简述」）
- 不是纯技术博客（博客公开但非主叙事，且当前无发文）
- 不是对任意 GitHub 用户开放完整履历

### 2.2 是什么

**「AI克塞号 / AI Kosei」的个人门户** —— 公开层：方向 + 部分作品；授权层：经历 + 项目概要 + 全部作品。

### 2.3 访客角色

| 角色 | 典型诉求 | 首要路径 |
|------|----------|----------|
| 陌生人 | 方向是否匹配、有无公开作品 | 首页 → `/works`（公开） |
| HR / 面试官 | 背景与经历 | 登录 → `/me` → `/experience` |
| 技术合作方 | 方案思路与代表产出 | 登录 → `/projects` → `/works` |
| 本人 | 维护内容与白名单 | Markdown + Vercel 环境变量 |

### 2.4 项目 vs 作品（已定边界）

| | **项目** | **作品** |
|---|----------|----------|
| **是什么** | 工作或建设中的**系统/平台**（偏「做过什么」） | Demo、开源、演讲、设计等**可展示产出** |
| **谁可以看** | 仅 **登录 + 白名单** | **部分公开** + 其余需登录 |
| **写什么** | **总结** + **设计方案简述**（背景、目标、架构思路） | 按类型写说明，可附链接/截图 |
| **不写什么** | 实现细节、代码结构、性能数据、客户/业务敏感信息 | 视具体作品；私密作品不含敏感材料 |
| **深度** | 刻意保持「摘要级」，详情面试口述 | 公开作品精选展示；完整库登录可见 |

**示例：**

- **项目（登录可见）：**「企业知识检索平台 — 多源接入、权限隔离、RAG 评估闭环（架构示意）」
- **作品（可公开）：** GitHub 开源仓库、Conference Slide、个人 Demo 链接

---

## 3. 信息架构（目标态 v2）

```
公开（无需登录）                    需登录 + 白名单
──────────────────────────────────────────────────────────
/                                   /me           履历总览
  Hero + 方向定位（无敏感信息）       /experience   职业经历（完整）
  About（仅方向）                    /projects     项目（总结+方案简述）
  公开作品精选 → /works              /projects/:slug
  登录 CTA                          /works        全部作品（含非公开）
/works                              /works/:slug
  └─ 仅 visibility=public 条目
/blog/*                             （公开作品在首页也可摘要展示）
/login
/auth/*
```

### 路由访问矩阵

| 路由 | 未登录 | 登录（白名单） |
|------|--------|----------------|
| `/` | ✅ 方向 + 公开作品摘要 | ✅ + 进入履历入口 |
| `/works` | ✅ 仅 `public` 作品 | ✅ 全部作品 |
| `/works/:slug` | ✅ 若该条 `public` | ✅ 全部 |
| `/blog/*` | ✅ | ✅ |
| `/projects` | ❌ → `/login` | ✅ 摘要级内容 |
| `/experience` | ❌ → `/login` | ✅ |
| `/me` | ❌ → `/login` | ✅ |

### 导航

**未登录：** `首页 | 作品 | 博客 | 登录`

**已登录：** `首页 | 履历 | 经历 | 项目 | 作品 | 博客 | 退出`

### 用户动线

```mermaid
flowchart TB
  A[公开首页] --> W[/works 公开作品]
  A --> B[/blog]
  A --> C[/login]
  C --> D{白名单?}
  D -->|否| E[拒绝]
  D -->|是| M[/me]
  M --> X[/experience]
  M --> P[/projects 摘要级]
  M --> WF[/works 全部]
```

## 4. 页面设计规格

### 4.1 公开首页 `/`

| 区块 | 内容 |
|------|------|
| Hero | 品牌 + **专业方向一句话**（无公司/客户/真实姓名） |
| About | 领域、方法论取向、能力方向（抽象描述） |
| 公开作品 | 2–4 条 `visibility: public` 的作品卡片 |
| 登录 CTA | 「登录查看完整履历与项目概要」 |
| 博客 | **暂不展示摘要**（当前无对外文章）；保留导航入口 |

**不出现：** 职业经历、项目列表、能力雷达、任何可识别雇主/项目的信息。

---

### 4.2 履历总览 `/me`（私密）

1. 个人抬头（可用昵称；真实姓名可选，仅私密区）
2. **职业时间线摘要** → `/experience`
3. **项目概要卡片**（仅 summary + 方案关键词）→ `/projects`
4. **非公开作品**入口 → `/works`
5. 能力/skills（私密，可从硬编码迁入 content）
6. ~~博客摘要~~（博客公开且暂无发文，不占用主屏）

---

### 4.3 职业经历 `/experience`（私密）

- 纵向时间线
- highlights + stack + 正文（仍须脱敏，无客户敏感信息）
- 完整深度仅在此模块，**项目模块不重复展开**

---

### 4.4 项目 `/projects`（私密 · 摘要级）

**内容上限（写内容时必须遵守）：**

| 允许 | 不允许 |
|------|--------|
| 项目背景（脱敏） | 代码实现、接口细节 |
| 目标与边界 | 客户名、内部系统名（除非已脱敏代号） |
| 架构/方案思路（示意级） | 性能指标、营收、团队内部流程 |
| 你的角色（抽象） | 长篇复盘 |

**Schema 建议拆分正文：**

- `summary` — 列表用一句话
- `designBrief` — 设计方案简述（Markdown，控制在约 300–600 字）
- ~~长正文 deep dive~~ — 不使用

---

### 4.5 作品 `/works`（混合可见）

| 字段 | 说明 |
|------|------|
| `visibility` | **`public` \| `private`**（P0 必加） |
| `title`, `description`, `type`, `url`, `image` | 已有 |
| 正文 | 公开作品宜短；私密作品可稍详 |

- **未登录访问 `/works`：** 只渲染 `visibility: public`
- **登录后：** 渲染全部；公开条目可打「公开」角标

---

### 4.6 博客 `/blog/*`（公开）

- **全部公开**；文章 frontmatter 默认 `draft: true` 直至你主动发布
- 当前策略：**导航保留，首页不展示空列表**；有第一篇对外文章后再加摘要区块

---

### 4.7 登录 `/login`

**目的：** 清晰说明访问规则，降低 HR 困惑。

- GitHub 登录按钮
- 白名单说明：「需站点所有者授权 GitHub 账号」
- 错误态：`not_allowed` / `oauth_failed` 等（已实现）

---

## 5. 内容模型（Schema 演进）

### 5.1 当前已有

- `experience` — company, role, start, end, location, highlights, stack, order
- `projects` — title, description, tech, role, url, image, featured, order
- `works` — title, description, type, url, image, order
- `blog` — 不变

### 5.2 Schema 变更（按 v2 决策）

**P0**

```ts
// works — 必加
visibility: 'public' | 'private'  // default: 'private'

// projects — 结构调整
summary: string                   // 列表一句话（可沿用 description）
designBrief: string               // 方案简述（Markdown 或 frontmatter 长字段）
// 移除/不写：长篇 impact、实现细节正文

// profile（单文件）
tagline, focusAreas[], publicBio  // publicBio 仅方向，给首页 About 用
```

**P1**

```ts
experience.confidential?: boolean
projects.period?, projects.role?   // 角色仍可用抽象表述
works.featured?, works.year?
skills collection
```

**不做（按当前决策）**

- 博客 `visibility` 分级（全部公开）
- 项目深度复盘 / impact 量化字段（避免写敏感信息）

---

## 6. 视觉与品牌

### 6.1 保留

- 「AI克塞号 / AI Kosei」品牌与 sci-fi 雷达视觉
- 现有 CSS 变量、SectionTitle 组件体系
- 中文为主，专业术语可中英并存

### 6.2 调整方向

| 区域 | 现况 | 目标 |
|------|------|------|
| 公开首页 | 偏「工程博客站点」 | 偏「专业履历门户 · 授权访问」 |
| `/me` | 旧首页区块堆叠 | 仪表盘式信息层级 |
| `/experience` | 卡片列表 | **时间线**视觉（左侧年份轴） |
| 项目/作品 | 通用卡片 | 项目仅摘要；作品分 public/private |
| 文案 | 「任务编队」「时间线日志」等 | **待定**（§6.4） |

### 6.4 界面用词（问题 4 说明 — 待你选择）

站点里有些标题用了**科幻/隐喻说法**，不是日常职场用语。问的是：**菜单和栏目标题用哪种风格？**

| 现用说法 | 若改成直白说法 |
|----------|----------------|
| 任务编队 | 项目 |
| 时间线日志 | 博客 |
| 能力坐标 | 技能 |
| 站点设定 | 关于 |
| 坐标（日期旁） | 发布于 |

**三个选项（回复 A / B / C 即可）：**

- **A — 全部直白：** 导航和标题都用「项目、博客、技能」等，仅保留「AI克塞号」作品牌名  
- **B — 混合（推荐）：** 主标题用直白（项目、作品、经历），科幻词只作小标签或装饰  
- **C — 全部保留：** 继续「任务编队、时间线日志」等现有风格  

### 6.3 组件待建

- `Timeline.astro` — 经历时间线
- `ProfileHeader.astro` — `/me` 抬头
- `ImpactList.astro` — 成果 bullet 样式
- `WorkTypeBadge.astro` — 作品类型标签
- `PrivateLayout.astro`（可选）— 私密区统一壳层 + 子导航

---

## 7. 实现现状 vs 差距

| 能力 | 状态 | 差距 |
|------|------|------|
| Vercel SSR | ✅ | — |
| GitHub OAuth + 白名单 | ✅ | 需配置 env + OAuth App |
| 路由门禁 middleware | ✅ | — |
| `/me` `/experience` `/projects` `/works` | ✅ 骨架 | 内容与 IA 未对齐目标 |
| 公开/私密内容分离 | ✅ | — |
| middleware 路由 | ✅ | `/works` 公开，`/me` 等需登录 |
| profile 集合 | ✅ | `src/content/profile/site.md` |
| 经历时间线 UI | ✅ | `Timeline.astro` |
| 作品详情页 | ✅ | `/works/[slug]` |
| 真实经历/作品 Markdown | ❌ | 仍为 placeholder |
| 域名 guanxcode.vip → Vercel | ✅ | 2026-05-31 已切换 |
| 构建告警修复 | ⚠️ 本地已改 | 未 push |

---

## 8. 分阶段路线图

### Phase 0 — 目标对齐

- [x] 保存站点目标与规划
- [x] 博客：公开
- [x] 公开 About：仅方向
- [x] 项目 vs 作品边界（v2）
- [x] 界面用词：B（混合）

### Phase 1 — 内容与 Schema

- [x] Schema、首页、`/me`、公开作品等（见上）
- [ ] 真实 `experience` 内容（**你筹备中**）
- [ ] 真实 `works` / `projects` 文案定稿（**你筹备中**）

### Phase 2 — 页面与组件（进行中）

- [x] 公开首页：方向 + 公开作品 + 博客
- [x] `/works` 公开/私密分轨
- [x] `/projects` 摘要级详情
- [x] `/experience` 时间线 UI（`Timeline.astro`）
- [x] `/me` 仪表盘 + `ProfileHeader`
- [x] 文案 B 风格（`SectionTitle` 主/副标题）
- [x] Hero 读取 `profile.tagline`；登录页、DEPLOY 文档更新
- [ ] 404 / 博客标签页等边角文案统一（可选）

### Phase 3 — 上线与运维（1 天）

- [ ] Vercel 环境变量 + GitHub OAuth 回调
- [x] 域名切换至 Vercel（`guanxcode.vip`，2026-05-31）
- [ ] 停用 GitHub Pages / 仓库 Pages 部署（避免冲突）
- [ ] 白名单添加目标访客 GitHub 用户名
- [ ] push 构建告警修复

### Phase 4 — 体验 polish（可选）

- [ ] 导出 PDF 履历
- [ ] 项目 ↔ 作品 ↔ 经历交叉链接
- [ ] 博客 visibility 分级
- [ ] 访问日志（简单 analytics）

---

## 9. 仍待确认

- 无（Phase 0 决策已全部闭合）

---

## 10. 内容清单（填写用）

### profile（公开方向，无敏感信息）

- [ ] `publicBio`：专业方向 2–3 句
- [ ] `tagline`：Hero 一句话
- [ ] `focusAreas[]`：如 AI 工程、架构、RAG

### experience（私密，每段一份 md）

- [ ] 经历 1：…
- [ ] …

### projects（私密，仅 summary + designBrief）

- [ ] rag-platform — summary + 方案简述（无实现细节）
- [ ] ticket-agent — …
- [ ] observability-dashboard — …

### works（标注 public / private）

- [ ] 公开作品 1：…
- [ ] 公开作品 2：…
- [ ] 私密作品 1：…

### blog

- [x] 现有文章全部公开

---

## 11. Markdown 填写模板（经历/作品筹备时用）

### experience — `src/content/experience/<id>.md`

```yaml
---
company: "（可脱敏代号）"
role: "岗位"
start: "2022-01"
end: "至今"
location: "城市（可选）"
highlights:
  - "可量化成果 1"
  - "可量化成果 2"
stack: [Java, Python]
order: 1
---

正文：职责补充（避免客户名、内部系统名等敏感信息）。
```

### works — `src/content/works/<id>.md`

```yaml
---
title: "作品名"
description: "一句话"
type: repo          # demo | design | talk | article | repo | other
visibility: public  # public | private
url: "https://..."
order: 1
---

可选正文说明。
```

### projects — 仅改 frontmatter 中的 `description` 与 `designBrief` 即可

---

*本文档随规划迭代更新；实现以 `docs/SITE-PLAN.md` 为单一事实来源。*
