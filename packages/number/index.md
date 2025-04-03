# 数字工具函数

这个模块提供了一系列处理数字的实用工具函数，用于执行常见的数字操作，如格式化、取值范围限制、随机数生成等。

## 安装

```bash
# npm
npm install sunpm-utils

# yarn
yarn add sunpm-utils

# pnpm
pnpm add sunpm-utils
```

## 使用方法

```js
// 导入需要的函数
import { clamp, formatThousands, round } from 'sunpm-utils'

// 四舍五入到指定小数位
const rounded = round(1.234, 2) // 1.23

// 格式化千位分隔符
const formatted = formatThousands(1234567) // "1,234,567"

// 限制数值范围
const clamped = clamp(150, 0, 100) // 100
```

## API 参考

### round

将数字四舍五入到指定小数位。

```js
/**
 * 将数字四舍五入到指定小数位
 * @param num 要处理的数字
 * @param precision 小数位数，默认为0（整数）
 * @returns 四舍五入后的数字
 */
function round(num: number, precision = 0): number
```

示例：

```js
import { round } from 'sunpm-utils'

console.log(round(1.234)) // 1
console.log(round(1.234, 2)) // 1.23
console.log(round(1.235, 2)) // 1.24
console.log(round(-1.234, 2)) // -1.23
```

### formatThousands

将数字格式化为带千位分隔符的字符串。

```js
/**
 * 将数字格式化为带千位分隔符的字符串
 * @param num 要格式化的数字
 * @param locale 区域设置，默认为浏览器默认区域
 * @returns 格式化后的字符串
 */
function formatThousands(num: number, locale?: string): string
```

示例：

```js
import { formatThousands } from 'sunpm-utils'

console.log(formatThousands(1000)) // "1,000" (按区域可能是 "1.000")
console.log(formatThousands(1000000)) // "1,000,000" (按区域可能是 "1.000.000")
console.log(formatThousands(1234.56)) // "1,234.56" (按区域可能是 "1.234,56")
```

### formatCurrency

将数字格式化为货币字符串。

```js
/**
 * 将数字格式化为货币字符串
 * @param value 要格式化的数字
 * @param options 格式化选项
 * @param options.currency 货币代码（如 'CNY', 'USD'）
 * @param options.locale 地区设置（如 'zh-CN', 'en-US'）
 * @param options.minimumFractionDigits 最小小数位数
 * @param options.maximumFractionDigits 最大小数位数
 * @returns 格式化后的货币字符串
 */
function formatCurrency(
  value: number,
  options?: {
    currency?: string
    locale?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
): string
```

示例：

```js
import { formatCurrency } from 'sunpm-utils'

// 默认为人民币格式（中文区域）
console.log(formatCurrency(1234.56)) // "¥1,234.56" 或 "￥1,234.56"

// 美元格式（英文区域）
console.log(formatCurrency(1234.56, {
  currency: 'USD',
  locale: 'en-US'
})) // "$1,234.56"

// 自定义小数位
console.log(formatCurrency(1234.5678, {
  maximumFractionDigits: 3
})) // "¥1,234.568"
```

### clamp

确保数字在指定范围内。

```js
/**
 * 确保数字在指定范围内
 * @param num 要检查的数字
 * @param min 最小值
 * @param max 最大值
 * @returns 在范围内的数字
 */
function clamp(num: number, min: number, max: number): number
```

示例：

```js
import { clamp } from 'sunpm-utils'

console.log(clamp(5, 0, 10)) // 5（在范围内，保持不变）
console.log(clamp(-5, 0, 10)) // 0（小于最小值，返回最小值）
console.log(clamp(15, 0, 10)) // 10（大于最大值，返回最大值）
```

### randomInt

生成指定范围内的随机整数。

```js
/**
 * 生成指定范围内的随机整数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 随机整数
 */
function randomInt(min: number, max: number): number
```

示例：

```js
import { randomInt } from 'sunpm-utils'

// 生成1到10之间的随机整数
console.log(randomInt(1, 10)) // 随机数，如 7

// 生成10到100之间的随机整数
console.log(randomInt(10, 100)) // 随机数，如 42
```

### isEven

检查一个数字是否为偶数。

```js
/**
 * 检查一个数字是否为偶数
 * @param num 要检查的数字
 * @returns 是否为偶数
 */
function isEven(num: number): boolean
```

示例：

```js
import { isEven } from 'sunpm-utils'

console.log(isEven(2)) // true
console.log(isEven(3)) // false
console.log(isEven(0)) // true
console.log(isEven(-2)) // true
```

### isOdd

检查一个数字是否为奇数。

```js
/**
 * 检查一个数字是否为奇数
 * @param num 要检查的数字
 * @returns 是否为奇数
 */
function isOdd(num: number): boolean
```

示例：

```js
import { isOdd } from 'sunpm-utils'

console.log(isOdd(1)) // true
console.log(isOdd(2)) // false
console.log(isOdd(0)) // false
console.log(isOdd(-1)) // true
```

### percentage

计算百分比。

```js
/**
 * 计算百分比
 * @param value 当前值
 * @param total 总值
 * @param precision 精度，默认为2
 * @returns 百分比值
 */
function percentage(value: number, total: number, precision = 2): number
```

示例：

```js
import { percentage } from 'sunpm-utils'

console.log(percentage(25, 100)) // 25
console.log(percentage(1, 3, 2)) // 33.33
console.log(percentage(1, 3, 0)) // 33
console.log(percentage(150, 200)) // 75
```

### formatNumberWithTenThousand

数值转万单位字符串。

```js
/**
 * 数值转万单位字符串
 * @param num 值
 * @param fractionDigits 小数位
 * @returns 格式化后的字符串
 */
function formatNumberWithTenThousand(num: number, fractionDigits = 2): string
```

示例：

```js
import { formatNumberWithTenThousand } from 'sunpm-utils'

console.log(formatNumberWithTenThousand(10000)) // "1.00万"
console.log(formatNumberWithTenThousand(12345)) // "1.23万"
console.log(formatNumberWithTenThousand(12345, 1)) // "1.2万"
console.log(formatNumberWithTenThousand(12345, 0)) // "1万"
console.log(formatNumberWithTenThousand(9999)) // "9999"
console.log(formatNumberWithTenThousand(0)) // "0"
```

## 注意事项

- 所有函数都不会修改原始数据，而是返回处理后的新值。
- 对于货币格式化，结果会根据浏览器和操作系统的区域设置而有所不同。
- 随机数生成不适用于需要加密安全的场景。
