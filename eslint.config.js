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
    '**/coverage/**',
  ],

  // 添加自定义规则
  rules: {
    // 除了在 Markdown 文件中允许使用 console，其它地方仍然警告
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // 如果您想要用分号，可以取消下面这行的注释
    // 'style/semi': ['error', 'always'],
  },
})
