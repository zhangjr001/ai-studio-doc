import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** GitHub Pages 项目站点部署在子路径 /ai-studio-doc 下 */
const basePath = '/ai-studio-doc';

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  basePath,
  assetPrefix: basePath,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default withMDX(config);
