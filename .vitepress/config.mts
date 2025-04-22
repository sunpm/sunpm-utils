import { defineConfig } from 'vitepress'
import typedocSidebar from '../docs/typedoc-sidebar.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@pmun/utils',
  description: '一个轻量级、模块化的 TypeScript 工具函数库，为日常开发提供便捷实用的工具集合。',
  lang: 'zh-CN',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: 'Home', link: '/' }, { text: 'Globals', link: '/globals' }],

    sidebar: [
      {
        text: 'API',
        items: typedocSidebar,
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sunpm/sunpm-utils' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@pmun/utils' },
    ],
    base: '/sunpm-utils',
    search: {
      provider: 'local',
      options: {
        placeholder: '搜索文档',
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            searchBox: {
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消',
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
              saveRecentSearchButtonTitle: '保存至搜索历史',
              removeRecentSearchButtonTitle: '从搜索历史中移除',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中移除',
            },
            errorScreen: {
              titleText: '无法获取结果',
              helpText: '你可能需要检查你的网络连接',
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为该查询应该有结果？',
              reportMissingResultsLinkText: '点击反馈',
            },
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
  },
  srcDir: 'docs',
  ignoreDeadLinks: true,

})
