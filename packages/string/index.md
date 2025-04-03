# 字符串工具函数

这个模块提供了一系列处理字符串的实用工具函数，用于执行常见的字符串操作，如大小写转换、格式转换和验证等。

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
// 导入所有字符串工具函数
import { capitalize, camelToKebab, truncate } from 'sunpm-utils/string'

// 或者使用命名导入特定函数
import { capitalize } from 'sunpm-utils/string'
```

## API 参考

### capitalize

将字符串的首字母转为大写。

```js
/**
 * 将字符串首字母转为大写
 * @param str 输入字符串
 * @returns 首字母大写后的字符串
 */
function capitalize(str: string): string
```

示例：

```js
import { capitalize } from 'sunpm-utils/string'

console.log(capitalize('hello')) // 'Hello'
console.log(capitalize('世界')) // '世界'
```

### camelToKebab

将驼峰命名法转换为短横线命名法（kebab-case）。

```js
/**
 * 将驼峰命名转换为短横线命名
 * @param str 驼峰命名的字符串
 * @returns 短横线命名的字符串
 */
function camelToKebab(str: string): string
```

示例：

```js
import { camelToKebab } from 'sunpm-utils/string'

console.log(camelToKebab('helloWorld')) // 'hello-world'
console.log(camelToKebab('userId')) // 'user-id'
console.log(camelToKebab('APIVersion')) // 'api-version'
```

### kebabToCamel

将短横线命名法（kebab-case）转换为驼峰命名法。

```js
/**
 * 将短横线命名转换为驼峰命名
 * @param str 短横线命名的字符串
 * @returns 驼峰命名的字符串
 */
function kebabToCamel(str: string): string
```

示例：

```js
import { kebabToCamel } from 'sunpm-utils/string'

console.log(kebabToCamel('hello-world')) // 'helloWorld'
console.log(kebabToCamel('user-id')) // 'userId'
```

### truncate

截取字符串并添加省略号。

```js
/**
 * 截取字符串并添加省略号
 * @param str 原始字符串
 * @param length 截取长度
 * @param ellipsis 省略号字符，默认为'...'
 * @returns 截取后的字符串
 */
function truncate(str: string, length?: number, ellipsis?: string): string
```

示例：

```js
import { truncate } from 'sunpm-utils/string'

const longText = '这是一段很长的文本，需要被截断并显示省略号'
console.log(truncate(longText, 10)) // '这是一段很长...'
console.log(truncate(longText, 15, '…')) // '这是一段很长的文本，需…'
```

### randomString

生成指定长度的随机字符串。

```js
/**
 * 生成指定长度的随机字符串
 * @param length 字符串长度
 * @param chars 可选的字符集，默认包含字母和数字
 * @returns 随机字符串
 */
function randomString(length: number, chars?: string): string
```

示例：

```js
import { randomString } from 'sunpm-utils/string'

// 生成包含字母和数字的10位随机字符串
console.log(randomString(10)) // 例如: 'a7Bf9xK3p2'

// 生成只包含数字的5位随机字符串
console.log(randomString(5, '0123456789')) // 例如: '83527'
```

### escapeHtml

将字符串中的 HTML 特殊字符转义，防止 XSS 攻击。

```js
/**
 * 将字符串中的 HTML 特殊字符转义
 * @param html 包含 HTML 的字符串
 * @returns 转义后的字符串
 */
function escapeHtml(html: string): string
```

示例：

```js
import { escapeHtml } from 'sunpm-utils/string'

const userInput = '<script>alert("XSS")</script>'
console.log(escapeHtml(userInput)) // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

### isValidUrl

检查字符串是否为有效的 URL。

```js
/**
 * 检查字符串是否为有效的 URL
 * @param url URL 字符串
 * @returns 是否为有效 URL
 */
function isValidUrl(url: string): boolean
```

示例：

```js
import { isValidUrl } from 'sunpm-utils/string'

console.log(isValidUrl('https://example.com')) // true
console.log(isValidUrl('not a url')) // false
```

### isValidEmail

检查字符串是否为有效的电子邮件地址。

```js
/**
 * 检查字符串是否为有效的电子邮件地址
 * @param email 电子邮件地址
 * @returns 是否为有效电子邮件
 */
function isValidEmail(email: string): boolean
```

示例：

```js
import { isValidEmail } from 'sunpm-utils/string'

console.log(isValidEmail('user@example.com')) // true
console.log(isValidEmail('invalid-email')) // false
```

### isEmptyString

检查字符串是否为空（不包含任何非空白字符）。

```js
/**
 * 检查字符串是否为空
 * @param str 要检查的字符串
 * @returns 如果字符串为空或只包含空白字符，则返回 true
 */
function isEmptyString(str: string): boolean
```

示例：

```js
import { isEmptyString } from 'sunpm-utils/string'

console.log(isEmptyString('')) // true
console.log(isEmptyString('  \n\t')) // true
console.log(isEmptyString('hello')) // false
```

### ensureRpxUnit

转为兼容 rpx 格式样式值


```js
import { ensureRpxUnit } from 'sunpm-utils'

console.log(ensureRpxUnit('4')) // 4rpx
console.log(ensureRpxUnit('4rpx')) // 4rpx
console.log(ensureRpxUnit('4px')) // 4px
console.log(ensureRpxUnit(4)) // 4rpx
console.log(ensureRpxUnit('auto')) // auto
```
