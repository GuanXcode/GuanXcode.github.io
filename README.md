# AI学不懂 — GuanXcode 个人品牌站

> 基于 Jekyll 的静态站点，部署在 GitHub Pages。

## 本地开发

```bash
bundle install
bundle exec jekyll serve
# 访问 http://127.0.0.1:4000
```

## 文件结构

```
├── _config.yml        # 站点配置
├── _data/             # 数据文件（项目列表等）
├── _includes/         # 复用组件（head, nav, footer）
├── _layouts/          # 页面布局模板
├── _posts/            # 博客文章（YYYY-MM-DD-title.md）
├── css/               # 样式文件
├── js/                # JavaScript
├── img/               # 图片资源
├── pwa/               # PWA 资源
├── index.html         # 首页
├── about.html         # 关于页面
├── portfolio.html     # 作品集页面
├── resume.md          # 简历页面
└── tags.html          # 标签页面
```

## 添加内容

### 新博客文章
在 `_posts/` 下创建 `YYYY-MM-DD-标题.md`：

```yaml
---
layout:     post
title:      "文章标题"
subtitle:   "副标题"
date:       2026-04-11
author:     GuanXcode
header-img: img/post-bg-xxx.jpg
catalog:    true
tags:
    - 标签1
---
```

### 新项目
编辑 `_data/projects.yml`，添加：

```yaml
- title: "项目名称"
  description: "项目简述"
  tech: [技术1, 技术2]
  url: "https://github.com/..."
```

## 技术栈

- Jekyll + Kramdown + Rouge
- 自定义 Flexbox 栅格（替代 Bootstrap 3）
- 原生 JavaScript（无 jQuery）
- Gitalk 评论系统
- PWA（Service Worker）
