import { Inter } from 'next/font/google';
import { Provider } from '@/components/provider';
import './global.css';
import type { Metadata } from 'next';
import { appName } from '@/lib/shared';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: `${appName} 文档`,
    template: `%s | ${appName}`,
  },
  description:
    'AI Studio 使用文档：工作流编辑器、知识库、模型管理、MCP 工具集成、观测评估与私有化部署指南。',
  metadataBase: new URL('https://zhangjr001.github.io/ai-studio-doc'),
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="zh-CN" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
