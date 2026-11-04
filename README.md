# AI Studio 文档站

[AI Studio](https://github.com/zhangjr001/ai-studio-doc) 的公开文档站，基于 [Fumadocs](https://fumadocs.dev)（Next.js + MDX + Tailwind CSS）构建，部署在 GitHub Pages。

**在线访问**：<https://zhangjr001.github.io/ai-studio-doc/>

## 本地开发

要求 Node.js 20+（推荐 22），包管理器使用 pnpm：

```bash
pnpm install
pnpm dev
```

因为站点部署在 GitHub Pages 子路径下，本地访问地址为 <http://localhost:3000/ai-studio-doc>。

构建静态站点（产物在 `out/`）：

```bash
pnpm build
```

## 写作指南

- 文档源文件位于 `content/docs/`，使用 MDX 格式；
- 每个目录内的 `meta.json` 控制侧边栏标题与顺序；
- 页面 frontmatter 支持 `title`、`description` 等字段；
- 可使用 `<Cards>`、`<Card>`、`<Callout>` 等 MDX 组件；
- 站点自动生成 `llms.txt` / `llms-full.txt`（LLM 友好格式的全文导出）。

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并发布到 GitHub Pages（见 `.github/workflows/deploy.yml`）。仓库 Settings → Pages 中 Source 需选择 **GitHub Actions**。

## 目录结构

```
app/            Next.js App Router 页面（首页 /docs 路由等）
components/     MDX 组件与搜索对话框
content/docs/   文档源文件（MDX）
lib/            内容源配置与共享常量
```

