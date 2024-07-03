const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "dist",
  webpack: (config) => {
    console.log('Configuração atual do Webpack:', config);
    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsconfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }
    console.log('Configuração do Webpack após adicionar TsconfigPathsPlugin:', config.resolve.plugins);
    return config;
  }
}

module.exports = nextConfig
