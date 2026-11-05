# 文档站搭建说明（SETUP）

> 本文档记录 ai-studio-doc 文档站从零搭建到上线的完整过程：技术选型、关键配置、踩坑记录与日常维护方式，供团队成员参考或复用到其他项目。

- 仓库：<https://github.com/zhangjr001/ai-studio-doc>
- 线上地址：<https://zhangjr001.github.io/ai-studio-doc/>
- 效果参考：Langfuse 官方文档（同为 Fumadocs 框架）

## 一、整体方案

| 事项 | 结论 |
| ---- | ---- |
| 目标 | 为 AI Studio 提供公开在线文档（Langfuse 官网形态） |
| 仓库策略 | 文档独立成库并公开；主代码仓库保持私有 |
| 托管 | GitHub Pages（公开仓库免费，push 即部署） |
| 形态 | 纯静态站点（Next.js 静态导出） |
| 构建 | GitHub Actions 自动构建并发布 |

**为什么独立仓库**：文档需要公开传播，而主代码仓库暂不公开；分库之后文档发布不依赖主仓库，也不需要为主仓库做公开前的安全清理。

## 二、技术选型

| 组件 | 选择 | 理由 |
| ---- | ---- | ---- |
| 框架 | Fumadocs 16 | Langfuse 文档同款；Next.js + MDX + Tailwind CSS；自带搜索、暗色模式、llms.txt |
| 模板 | static（`output: 'export'`） | GitHub Pages 只能托管纯静态文件，必须静态导出 |
| 搜索 | orama 静态索引 | 构建期生成索引、浏览器端查询，无需服务器 |
| 运行时 | Node 22 + pnpm | 最新版脚手架要求 Node 22+ |

备选方案 Docusaurus（Meta 出品，更成熟、i18n 强）未采用：观感偏传统，且与参考站形态不一致。

## 三、搭建步骤

### 1. 初始化脚手架（需 Node 22）

```bash
npx create-fumadocs-app@latest ai-studio-doc \
  --pm pnpm --no-git -y \
  --search orama \
  --template +next+fuma-docs-mdx+static
pnpm install
```

生成的项目结构：

```
app/           # 首页、/docs 路由、llms.txt、OG 图（Next.js App Router）
components/    # MDX 组件注册、搜索对话框
content/docs/  # 文档源文件（MDX）
lib/           # 内容源配置与共享常量
```

### 2. 解决镜像源缺包问题

国内镜像源可能未同步最新发布的包（本例：`framer-motion@14.9.1` 404）。在项目根目录写 `.npmrc` 指向官方源，仅影响本项目、不改全局配置：

```ini
registry=https://registry.npmjs.org
```

### 3. 适配 Pages 子路径（关键配置）

项目站点地址是 `username.github.io/<repo>/`，所有资源都在子路径下。修改 `next.config.mjs`：

```js
const basePath = '/ai-studio-doc';

const config = {
  output: 'export',        // 静态导出到 out/
  basePath,
  assetPrefix: basePath,   // 静态资源 URL 前缀
  reactStrictMode: true,
};
```

配置后 Next 的 `<Link>` 会自动带上前缀；本地 dev 访问地址相应变为 `http://localhost:3000/ai-studio-doc`。

### 4. 站点信息与文档内容

- `lib/shared.ts`：`appName`（导航栏标题）、`gitConfig`（GitHub 链接）
- `app/layout.tsx`：`lang="zh-CN"` 与站点 metadata
- `app/(home)/page.tsx`：首页（hero + 功能卡片）
- `content/docs/`：MDX 文档，**每级目录的 `meta.json` 控制侧边栏标题与顺序**：

```
content/docs/
├── index.mdx          # 总览
├── meta.json          # 根侧边栏顺序
├── getting-started/
├── concepts/
├── workflow/          # index、ai-builder
├── knowledge/         # index、ingestion、search
├── models/
├── prompts/
├── integrations/      # mcp、observability
└── deployment/
```

页面写法：

```mdx
---
title: 快速开始
description: 用 Docker Compose 启动 AI Studio
---

正文支持 Markdown 语法与 <Cards>、<Card>、<Callout> 等 MDX 组件。
```

### 5. 部署工作流

`.github/workflows/deploy.yml`（完整内容见仓库）：push `main` 时自动构建发布。关键点：

```yaml
permissions:
  contents: read
  pages: write          # 发布 Pages 必需
  id-token: write       # OIDC 认证必需

jobs:
  build:    # pnpm install → pnpm build → 上传 out/ 产物
  deploy:   # actions/deploy-pages@v4 发布
```

### 6. 启用 GitHub Pages（容易遗漏）

工作流首次运行时 deploy 阶段会失败，原因是仓库未启用 Pages。开启方式二选一：

- 网页：**Settings → Pages → Build and deployment → Source 选 "GitHub Actions"**
- API：`POST /repos/{owner}/{repo}/pages`，body：`{"build_type": "workflow"}`

之后在 Actions 页面 Re-run 一次、或再 push 一次即可。

### 7. 提交推送（保护个人隐私）

公开仓库的提交邮箱不要用个人/公司邮箱，使用 GitHub noreply 地址（仓库级配置，不影响全局）：

```bash
git init -b main
git config user.name 'zhangjr001'
git config user.email 'zhangjr001@users.noreply.github.com'
git remote add origin https://github.com/zhangjr001/ai-studio-doc.git
git push -u origin main
```

若远程有建仓时自动生成的 Initial commit，确认无实际内容后 `git push --force` 覆盖。

## 四、踩坑速查表

| # | 现象 | 原因 | 解决 |
| - | ---- | ---- | ---- |
| 1 | 脚手架启动报 `findPackageJSON` 语法错误 | 最新脚手架依赖高版本 Node 才有的 API | `nvm use 22` |
| 2 | `pnpm install` 404 新版本包 | 镜像源同步滞后 | 项目级 `.npmrc` 指官方源 |
| 3 | 构建报 `LANGUAGE_NOT_SUPPORTED` | orama 不支持 `language: 'chinese'` | 不传该参数，用默认 multilingual 分词器（支持中文） |
| 4 | 部署后页面白屏 / CSS 404 | 项目站点在子路径 | `basePath` + `assetPrefix` |
| 5 | Actions 的 deploy 任务失败 | Pages 未启用或 Source 不是 GitHub Actions | 见「步骤 6」 |
| 6 | push 被拒 fetch first | 远程有建仓自动提交 | 确认远程无内容后 force push |

## 五、验证清单

上线前本地自测：

```bash
pnpm build      # 产物输出到 out/（本站共 45 个静态页面）
# 模拟 Pages 子路径访问：
mkdir -p /tmp/pages-sim && cp -r out /tmp/pages-sim/ai-studio-doc
npx serve /tmp/pages-sim    # 浏览器打开 http://localhost:3000/ai-studio-doc/
```

线上抽查（部署完成后）：

- 首页与各文档页（无 `.html` 后缀的 clean URL）返回 200
- `/llms.txt`、`/llms-full.txt` 返回 200
- `/api/search`（静态搜索索引文件）返回 200

## 六、日常维护

| 场景 | 操作 |
| ---- | ---- |
| 修改文档 | 编辑 `content/docs/**/*.mdx`，push `main` 即自动发布（约 1 分钟） |
| 本地预览 | `pnpm dev` → `http://localhost:3000/ai-studio-doc` |
| 新增章节 | 新建目录 + 目录内 `meta.json`（`title` + `pages`），并在根 `meta.json` 的 `pages` 数组登记 |
| 调侧边栏顺序 | 修改对应目录的 `meta.json` |

框架附赠能力（无需配置）：`llms.txt` 站点索引、`llms-full.txt` 全量导出、每页 `content.md` 原文与 OG 分享图。
