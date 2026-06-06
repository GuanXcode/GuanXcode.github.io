# GuanXcode.github.io

这是一个基于 Astro 的个人站点，包含首页、博客、标签页和项目展示。

## 目录结构

```text
src/
├── components/  # 可复用 UI 组件
├── content/     # 博客与项目 Markdown 内容
├── layouts/     # 全站布局
├── pages/       # 路由页面
└── styles/      # 全局样式与主题变量
```

## 脚本

```sh
npm run dev
npm run build
npm run check
npm run preview
```

## 部署

仓库通过 GitHub Actions 构建并发布到 GitHub Pages，工作流位于 `.github/workflows/deploy.yml`。
