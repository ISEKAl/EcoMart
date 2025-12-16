import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// 正确导入：@arco-plugins/vite-react 是命名导出，需用 {} 解构
import { vitePluginForArco } from '@arco-plugins/vite-react'

export default defineConfig({
  plugins: [
    react(),
    // 正确调用插件（替换之前的 arcoPlugin()）
    vitePluginForArco({
      style: 'css', // 按需引入组件样式（必配）
      // theme: {
      //   'arcoblue-6': '#2563eb', // 自定义主题色（可选）
      // },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  // GitHub Pages 部署配置
  base: '/EcoMart/',
})