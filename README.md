# @pmun/utils

`@pmun/utils` 是面向 JavaScript 和 TypeScript 开发者的日常工具函数库。

- **数组与树**：去重、分组、排序和查找树节点。
- **日期**：格式化、时间差、日期范围和倒计时。
- **字符串**：命名转换、JSON 解析和 UUID 生成。
- **对象**：深拷贝、合并和读取嵌套属性。
- **数字**：金额格式化、四舍五入和范围限制。
- **类型检查**：判断数据类型和空值。
- **异步**：超时、重试、防抖、节流和并发控制。
- **URL**：解析和追加查询参数、处理路径开头的 `/`。

[API 文档](https://sunpm.github.io/sunpm-utils/globals) · [版本历史](https://github.com/sunpm/sunpm-utils/blob/main/CHANGELOG.md) · [MIT 许可证](LICENSE)

## 使用示例

```ts
import { formatDate, unique } from '@pmun/utils'

unique([1, 2, 2, 3]) // [1, 2, 3]
formatDate('2026-01-15', 'YYYY/MM/DD') // '2026/01/15'
```

## 使用要求

| 项目 | 要求 |
| --- | --- |
| JavaScript | 支持 ES2020；本包仅提供 ESM（`import`）格式。 |
| 安装工具 | Node.js，以及 npm、pnpm 或 Yarn 之一。 |
| TypeScript | 可选，已包含类型定义。 |
| 依赖 | `dayjs`，随本包自动安装。 |

## 安装步骤

1. 进入使用本库的项目目录（`package.json` 所在目录）。
2. 按项目的包管理器选择一条命令：

   ```bash
   npm install @pmun/utils
   # 或 pnpm add @pmun/utils
   # 或 yarn add @pmun/utils
   ```
