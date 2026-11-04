import Link from 'next/link';
import { appName } from '@/lib/shared';

const features = [
  {
    title: '工作流编辑器',
    desc: '画布式编排，节点连线、变量引用、运行调试；支持自然语言 AI 构建工作流。',
    href: '/docs/workflow',
  },
  {
    title: '知识库',
    desc: '文档上传解析（OCR-VL 视觉解析、Whisper 语音转写）、分块清洗、向量索引与多模态检索。',
    href: '/docs/knowledge',
  },
  {
    title: '模型管理',
    desc: '统一接入对话、嵌入、重排、多模态四类模型，兼容 OpenAI 协议与本地推理服务。',
    href: '/docs/models',
  },
  {
    title: 'MCP 工具',
    desc: '接入 Model Context Protocol 服务器，让 Agent 调用外部工具与数据源。',
    href: '/docs/integrations/mcp',
  },
  {
    title: '提示词库',
    desc: '团队共享的提示词模板管理，支持版本、参数化与在线调试。',
    href: '/docs/prompts',
  },
  {
    title: '观测与评估',
    desc: '运行 Trace 全链路追踪、Token 用量统计与输出质量评估。',
    href: '/docs/integrations/observability',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      <section className="flex flex-col items-center justify-center text-center gap-6 py-24 px-6 border-b">
        <span className="rounded-full border bg-fd-secondary px-3 py-1 text-xs font-medium text-fd-secondary-foreground">
          开源 · 私有化部署 · 多模型接入
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {appName} 使用文档
        </h1>
        <p className="max-w-2xl text-fd-muted-foreground text-lg leading-relaxed">
          开箱即用的企业级 AI Agent 与工作流平台。
          在一个平台上完成工作流编排、知识库构建、模型管理与运行观测。
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/docs/getting-started"
            className="rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground transition hover:opacity-90"
          >
            快速开始
          </Link>
          <Link
            href="/docs"
            className="rounded-lg border px-5 py-2.5 font-medium transition hover:bg-fd-accent"
          >
            浏览文档
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8 md:p-12 max-w-6xl mx-auto w-full">
        {features.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="group rounded-xl border p-5 transition hover:bg-fd-accent"
          >
            <h2 className="text-lg font-semibold mb-2 group-hover:text-fd-primary">
              {f.title}
            </h2>
            <p className="text-sm text-fd-muted-foreground leading-relaxed">
              {f.desc}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
