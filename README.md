# sunpm-utils

[![npm version](https://img.shields.io/npm/v/sunpm-utils.svg)](https://www.npmjs.com/package/sunpm-utils)
[![license](https://img.shields.io/npm/l/sunpm-utils.svg)](https://github.com/sunpm/sunpm-utils/blob/main/LICENSE)

一个轻量级、模块化的 TypeScript 工具函数库，为日常开发提供便捷实用的工具集合。

## 特点

- 🚀 **轻量级**：按需引入，不增加项目体积
- 🧩 **模块化**：合理划分模块，易于使用和维护
- 📦 **零依赖**：除日期处理外无外部依赖
- 🔒 **类型安全**：完全使用 TypeScript 编写，提供完整类型定义
- 💯 **测试全面**：每个函数都有完善的单元测试

## 安装

```bash
# npm
npm install sunpm-utils

# yarn
yarn add sunpm-utils

# pnpm
pnpm add sunpm-utils
```

## 使用

可以按需导入特定模块的函数：

```typescript
// 导入特定模块的函数
import { chunk, unique } from 'sunpm-utils/array'
import { formatDate } from 'sunpm-utils/date'
import { isString } from 'sunpm-utils/is'

// 使用数组工具函数
const arr = [1, 2, 2, 3, 3, 4]
const uniqueArr = unique(arr) // [1, 2, 3, 4]
const chunks = chunk(arr, 2) // [[1, 2], [2, 3], [3, 4]]

// 使用日期格式化
const formattedDate = formatDate(new Date(), 'YYYY-MM-DD') // 例如：'2023-11-10'

// 使用类型检查
console.log(isString('hello')) // true
```

## 功能模块

- **数组操作 (array)**：数组去重、分块、查找、过滤、转换等处理函数
- **日期时间 (date)**：日期格式化、计算、比较等函数
- **字符串处理 (string)**：字符串转换、格式化、验证等
- **对象操作 (object)**：对象深拷贝、合并、转换等
- **数字处理 (number)**：数字格式化、四舍五入、范围控制等
- **类型检查 (is)**：各种数据类型的判断函数

## 文档

每个模块都有详细的文档说明和使用示例：

- [数组工具函数](./src/array/index.md)
- [日期工具函数](./src/date/index.md)
- [字符串工具函数](./src/string/index.md)
- [对象工具函数](./src/object/index.md)
- [数字工具函数](./src/number/index.md)
- [类型检查函数](./src/is/index.md)

## 许可证

[MIT](LICENSE)
