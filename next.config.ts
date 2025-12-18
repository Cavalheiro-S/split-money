import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
};

// Configuração do Sentry Webpack Plugin
export default withSentryConfig(nextConfig, {
  // Para todas as opções disponíveis, veja:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Apenas fazer upload de source maps em produção
  silent: !process.env.CI,

  // Upload de source maps durante build
  widenClientFileUpload: true,

  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },

  // Ocultar source maps
  sourcemaps: {
    disable: false,
  },
});
