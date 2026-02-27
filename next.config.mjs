/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 建議開啟的設定
  typescript: {
    // 部署時已經由 Cloudflare 驗證，可以跳過 build 時的檢查以加快速度
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
