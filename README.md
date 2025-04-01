# sunpm-utils

个人 TypeScript 工具函数库，提供常用的实用工具函数。

## 安装

```bash
pnpm add sunpm-utils
```

## 使用

```typescript
import { isString, formatDate } from 'sunpm-utils';

// 使用工具函数
isString('hello'); // true
formatDate(new Date(), 'YYYY-MM-DD'); // "2023-11-10"
```

## 功能模块

- **字符串操作**：字符串处理、格式化等
- **数字处理**：数字格式化、四舍五入等
- **日期时间**：日期格式化、计算等
- **数组操作**：数组处理、过滤、转换等
- **对象操作**：深拷贝、合并等
- **类型检查**：类型判断函数
- **浏览器工具**：localStorage封装、Cookie操作等
- **DOM操作**：常用DOM操作封装
- **URL处理**：URL参数提取、拼接等

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 运行测试
pnpm test

# 构建
pnpm build
```

## 许可证

ISC 
