/**
 * @module 字符串处理
 * @description 提供各种字符串处理函数，包括字符串转换、格式化、验证等实用功能
 */

import { isNaN, isString } from '../is'

/**
 * 将字符串首字母转为大写
 * @param str 输入字符串
 * @returns 首字母大写后的字符串
 * @group String
 * @example
 * ```ts
 * capitalize('hello') // 'Hello'
 * capitalize('') // ''
 * capitalize('a') // 'A'
 * ```
 */
export function capitalize(str: string): string {
  if (str.length === 0)
    return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 将驼峰命名转换为短横线命名（kebab-case）
 * @param str 驼峰命名的字符串
 * @returns 短横线命名的字符串
 * @group String
 * @example
 * ```ts
 * camelToKebab('helloWorld') // 'hello-world'
 * camelToKebab('HelloWorld') // 'hello-world'
 * camelToKebab('APIVersion') // 'api-version'
 * camelToKebab('iOS9App') // 'i-os9-app'
 * ```
 */
export function camelToKebab(str: string): string {
  // 处理首字母大写的情况，如 APIVersion -> api-version
  return str
    .replace(/([A-Z])([A-Z]+)([A-Z])/g, '$1$2-$3') // 处理连续大写字母
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * 将短横线命名（kebab-case）转换为驼峰命名（camelCase）
 * @param str 短横线命名的字符串
 * @returns 驼峰命名的字符串
 * @group String
 * @example
 * ```ts
 * kebabToCamel('hello-world') // 'helloWorld'
 * kebabToCamel('api-version') // 'apiVersion'
 * kebabToCamel('i-os9-app') // 'iOs9App'
 * kebabToCamel('--hello') // 'hello'
 * ```
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

/**
 * 截取字符串并添加省略号
 * @param str 原始字符串
 * @param length 截取的最大长度，默认为 50
 * @param ellipsis 省略号字符，默认为'...'
 * @returns 截取后的字符串，如果原字符串长度小于等于截取长度，则返回原字符串
 * @group String
 * @example
 * ```ts
 * truncate('这是一个很长的字符串', 5) // '这是...'
 * truncate('这是一个很长的字符串', 5, '…') // '这是一…'
 * truncate('短字符', 10) // '短字符'
 * ```
 */
export function truncate(str: string, length: number = 50, ellipsis: string = '...'): string {
  if (str.length <= length)
    return str

  // 计算需要保留的字符数 = 总长度 - 省略号长度
  const truncatedLength = length - ellipsis.length
  return str.substring(0, truncatedLength) + ellipsis
}

/**
 * 生成指定长度的随机字符串
 * @param length 字符串长度
 * @param chars 可选的字符集，默认包含大小写字母和数字
 * @returns 生成的随机字符串
 * @group String
 * @example
 * ```ts
 * randomString(5) // 例如: 'aB9cD'
 * randomString(10) // 例如: 'aBcD1eF2gH'
 * randomString(3, '123456') // 例如: '426'
 * ```
 */
export function randomString(length: number, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = ''
  const charsLength = chars.length

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength))
  }

  return result
}

/**
 * 将字符串中的 HTML 特殊字符转义，防止 XSS 攻击
 * @param html 包含 HTML 的字符串
 * @returns 转义后的安全字符串
 * @group String
 * @example
 * ```ts
 * escapeHtml('<div>Hello & World</div>') // '&lt;div&gt;Hello &amp; World&lt;/div&gt;'
 * escapeHtml('<script>alert("XSS")</script>') // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 * ```
 */
export function escapeHtml(html: string): string {
  const entityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  }

  return html.replace(/[&<>"'`=/]/g, s => entityMap[s] || s)
}

/**
 * 检查字符串是否为有效的 URL
 * @param url 要检查的 URL 字符串
 * @returns 如果是有效的 URL 则返回 true，否则返回 false
 * @group String
 * @example
 * ```ts
 * isValidUrl('https://example.com') // true
 * isValidUrl('http://localhost:3000') // true
 * isValidUrl('example.com') // false，缺少协议
 * isValidUrl('not a url') // false
 * ```
 */
export function isValidUrl(url: string): boolean {
  try {
    return Boolean(new URL(url))
  }
  catch {
    return false
  }
}

/**
 * 检查字符串是否为有效的电子邮件地址
 * @param email 要检查的电子邮件地址
 * @returns 如果是有效的电子邮件地址则返回 true，否则返回 false
 * @group String
 * @example
 * ```ts
 * @group String
 * isValidEmail('user@example.com') // true
 * @group String
 * isValidEmail('user.name+tag@example.co.uk') // true
 * isValidEmail('invalid@email') // false，缺少顶级域名
 * isValidEmail('not an email') // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const re = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
  return re.test(email)
}

/**
 * 检查字符串是否为空或只包含空白字符
 * @param str 要检查的字符串
 * @returns 如果字符串为空或只包含空白字符，则返回 true
 * @group String
 * @example
 * ```ts
 * isEmptyString('') // true
 * isEmptyString('  \t\n  ') // true
 * isEmptyString('hello') // false
 * isEmptyString(' hello ') // false
 * ```
 */
export function isEmptyString(str: string): boolean {
  return str.trim().length === 0
}

/**
 * 确保值具有 rpx 单位，主要用于小程序/uni-app 样式处理
 * @param val 需要转化的值，可以是数字或字符串
 * @returns 转化后带有 rpx 单位的字符串，如果输入不是数字则原样返回
 * @group String
 * @example
 * ```ts
 * ensureRpxUnit(100) // '100rpx'
 * ensureRpxUnit('100') // '100rpx'
 * ensureRpxUnit('100px') // '100px'，不是数字，保持原样
 * ensureRpxUnit('auto') // 'auto'，不是数字，保持原样
 * ```
 */
export function ensureRpxUnit(val: string | number): string {
  const str = Number(val)
  if (isNaN(str)) {
    return val as string
  }
  return `${val}rpx`
}

/**
 * 替换字符串中的 `&nbsp;` 为不换行空格
 *
 * @param {string} str - 字符串
 * @returns {string} 处理后的字符串
 *
 * @group String
 * @example
 * ```ts
 * // 基本用法
 * replaceNBSP('John&nbsp;Doe') // 'John Doe'
 * replaceNBSP('Jane&nbsp;&nbsp;Smith') // 'Jane  Smith'
 * replaceNBSP('Smith') // 'Smith'
 * ```
 */
export function replaceNBSP(str?: string): string {
  if (!isString(str)) {
    return str as any // 应该忽略非字符串字段
  }

  return str.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ')
}

/**
 * 解析JSON字符串，处理异常情况
 *
 * 支持解析各种有效的JSON格式，包括对象、数组、字符串、数字、布尔值等。
 * 如果解析失败，会在控制台输出错误信息并返回原始字符串。
 *
 * @param str 待解析的字符串
 * @param defaultValue 解析失败时的默认返回值，默认为原始字符串
 * @returns 解析后的对象、数组或其他JSON值，解析失败时返回默认值
 * @group String
 * @example
 * ```ts
 * // 解析对象
 * parseJsonStr('{"name": "Tom", "age": 25}') // { name: 'Tom', age: 25 }
 *
 * // 解析数组
 * parseJsonStr('[1, 2, 3]') // [1, 2, 3]
 *
 * // 解析基础类型
 * parseJsonStr('"hello"') // 'hello'
 * parseJsonStr('123') // 123
 * parseJsonStr('true') // true
 *
 * // 处理无效JSON
 * parseJsonStr('{invalid json}') // '{invalid json}'（返回原字符串）
 *
 * // 处理空值
 * parseJsonStr('') // {}
 * parseJsonStr(null) // {}
 * parseJsonStr(undefined) // {}
 *
 * // 自定义默认值
 * parseJsonStr('invalid', null) // null
 *
 * // 非JSON格式的字符串
 * parseJsonStr('hello world') // 'hello world'
 * ```
 */
export function parseJsonStr<T = any>(str?: string | null, defaultValue?: T): T | string | Record<string, any> {
  // 处理空值情况
  if (!str) {
    return defaultValue !== undefined ? defaultValue : {}
  }

  // 确保输入是字符串
  if (!isString(str)) {
    return defaultValue !== undefined ? defaultValue : str as any
  }

  const trimmedStr = str.trim()

  // 检查是否可能是JSON格式
  const isLikelyJson = (
    // 对象格式
    (trimmedStr.startsWith('{') && trimmedStr.endsWith('}'))
    // 数组格式
    || (trimmedStr.startsWith('[') && trimmedStr.endsWith(']'))
    // 字符串格式
    || (trimmedStr.startsWith('"') && trimmedStr.endsWith('"'))
    // 数字格式（包括负数、小数、科学计数法）
    || /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(trimmedStr)
    // 布尔值和null
    || ['true', 'false', 'null'].includes(trimmedStr)
  )

  // 如果不像JSON格式，直接返回原字符串
  if (!isLikelyJson) {
    return defaultValue !== undefined ? defaultValue : str
  }

  try {
    return JSON.parse(trimmedStr) as T
  }
  catch {
    // JSON 解析失败时返回默认值或原字符串，这是预期行为
    return defaultValue !== undefined ? defaultValue : str
  }
}

/**
 * 将字符串分割成单词数组
 * @param str 要分割的字符串
 * @returns 单词数组
 * @group String
 * @example
 * ```ts
 * words('hello world') // ['hello', 'world']
 * words('helloWorld') // ['hello', 'World']
 * words('hello-world-foo') // ['hello', 'world', 'foo']
 * words('hello_world_foo') // ['hello', 'world', 'foo']
 * words('HelloWorldFoo') // ['Hello', 'World', 'Foo']
 * words('hello123world') // ['hello', '123', 'world']
 * ```
 */
export function words(str: string): string[] {
  // 匹配连续的字母数字字符、或大写字母开头的驼峰单词
  // 改进：支持全大写带下划线的情况
  const pattern = /[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z]|\d|\W|$|\b)|\d+|[A-Z]+/g
  return str.match(pattern) || []
}

/**
 * 将字符串转换为蛇形命名（snake_case）
 * @param str 输入字符串
 * @returns 蛇形命名的字符串
 * @group String
 * @example
 * ```ts
 * snakeCase('helloWorld') // 'hello_world'
 * snakeCase('HelloWorld') // 'hello_world'
 * snakeCase('hello-world') // 'hello_world'
 * snakeCase('hello world') // 'hello_world'
 * snakeCase('HelloWorldFoo') // 'hello_world_foo'
 * ```
 */
export function snakeCase(str: string): string {
  return words(str).map(word => word.toLowerCase()).join('_')
}

/**
 * 将字符串转换为帕斯卡命名（PascalCase）
 * @param str 输入字符串
 * @returns 帕斯卡命名的字符串
 * @group String
 * @example
 * ```ts
 * pascalCase('hello world') // 'HelloWorld'
 * pascalCase('hello-world') // 'HelloWorld'
 * pascalCase('hello_world') // 'HelloWorld'
 * pascalCase('helloWorld') // 'HelloWorld'
 * pascalCase('HELLO_WORLD') // 'HelloWorld'
 * ```
 */
export function pascalCase(str: string): string {
  return words(str)
    .map(word => capitalize(word.toLowerCase()))
    .join('')
}

/**
 * 简单的模板字符串替换
 * @param template 模板字符串，使用 {{key}} 或 {key} 标记占位符
 * @param data 数据对象
 * @returns 替换后的字符串
 * @group String
 * @example
 * ```ts
 * template('Hello {{name}}!', { name: 'Tom' }) // 'Hello Tom!'
 * template('Hello {name}, you are {age} years old', { name: 'Tom', age: 25 })
 * // 'Hello Tom, you are 25 years old'
 *
 * // 支持嵌套属性访问
 * template('Hello {{user.name}}!', { user: { name: 'Tom' } }) // 'Hello Tom!'
 *
 * // 未找到的键会保持原样
 * template('Hello {{name}}!', {}) // 'Hello {{name}}!'
 * ```
 */
export function template(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{?(\w+(?:\.\w+)*)\}?\}/g, (match, key) => {
    // 支持点分隔的嵌套属性访问，如 user.name
    const keys = key.split('.')
    let value: any = data

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      }
      else {
        return match // 如果找不到键，保持原样
      }
    }

    return value !== undefined && value !== null ? String(value) : match
  })
}
