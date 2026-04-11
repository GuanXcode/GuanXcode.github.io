# AI学不懂

GuanXcode 个人品牌站 — 关注 AI 场景化落地与技术架构实践。

基于 Jekyll 构建，部署于 GitHub Pages，自定义域名 `guanxcode.vip`。

## 技术栈

- **静态站点**：Jekyll + Kramdown + Rouge
- **样式**：自定义 Flexbox 栅格 + CSS 自定义属性
- **脚本**：原生 JavaScript（无框架依赖）
- **评论**：Gitalk（GitHub Issues 驱动）
- **PWA**：Service Worker 离线缓存
- **分析**：百度统计 + Google Analytics

## 站点结构

```
├── _config.yml          站点配置
├── _data/projects.yml   作品集数据
├── _includes/           头部、导航、页脚组件
├── _layouts/            布局模板（default / post / page / keynote）
├── _posts/              博客文章（YYYY-MM-DD-title.md）
├── css/                 grid.css + hux-blog.css + syntax.css
├── js/                  hux-blog.js + tagcloud.js + catalog.js
├── img/                 图片资源
├── pwa/                 PWA manifest + 图标
├── sw.js                Service Worker
├── index.html           首页（文章列表）
├── about.html           关于
├── portfolio.html       作品集
├── resume.md            简历
└── tags.html            标签云
```

## 本地运行

```bash
bundle install
bundle exec jekyll serve
# http://127.0.0.1:4000
```

## 写文章

在 `_posts/` 下新建 `YYYY-MM-DD-标题.md`：

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
    - 标签2
---
```

## 加项目

编辑 `_data/projects.yml`：

```yaml
- title: "项目名称"
  description: "一句话介绍"
  tech: [Python, LLM, RAG]
  url: "https://github.com/guanxcode/..."
  image: "img/projects/xxx.jpg"
```
