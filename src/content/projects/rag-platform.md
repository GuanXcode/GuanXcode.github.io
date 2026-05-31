---
title: "企业知识中台（RAG）"
description: "面向业务场景的知识检索与问答平台，支持多源接入、权限隔离与可观测评估。"
designBrief: |
  **目标：** 为业务团队提供可信赖的知识问答能力，避免「黑盒检索」。

  **方案要点：**
  - 多源数据统一接入与清洗管道
  - 检索链路分层：召回 → 重排 → 生成，各阶段可观测
  - 权限与租户隔离，评估集驱动迭代

  *（摘要级介绍，不含实现细节与敏感业务信息。）*
tech:
  - Python
  - FastAPI
  - PostgreSQL
  - Redis
  - OpenAI
role: "架构与核心开发"
period: "2023 — 至今"
image: "/img/post-bg-universe.jpg"
featured: true
order: 1
---
