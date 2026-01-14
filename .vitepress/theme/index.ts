import DefaultTheme from 'vitepress/theme'
import * as _ from '../../packages/core'

export default {
  extends: DefaultTheme,
  enhanceApp() {
    // 仅在浏览器环境下挂载到 window
    if (typeof window !== 'undefined') {
      ;(window as any)._ = _
      console.log('🛠️ @pmun/utils 已挂载到 window._，可以在控制台直接使用')
      console.log('示例: _.formatDate(new Date())')
    }
  },
}
