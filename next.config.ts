import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "200mb",
    },
  },
}

export default nextConfig
