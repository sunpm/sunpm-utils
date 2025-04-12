// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  // 启用 TypeScript 支持
  typescript: true,

  // 启用 Prettier 集成
  formatters: true,

  // 启用 Vue 支持 (如果需要的话)
  // vue: true,

  // 忽略特定文件或文件夹
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.git/**',
    '**/coverage/**',
    '**/**.md',
  ],

  // 添加自定义规则
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
})
