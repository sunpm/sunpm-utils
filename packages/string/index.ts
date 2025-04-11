/**
 * @module 字符串处理
 * @description 提供各种字符串处理函数，包括字符串转换、格式化、验证等实用功能
 */

import { isNaN } from '../is'

/**
 * 将字符串首字母转为大写
 * @param str 输入字符串
 * @returns 首字母大写后的字符串
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
 * @example
 * ```ts
 * isValidEmail('user@example.com') // true
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
 * 替换表格数据中指定字段的 &nbsp; 为不换行空格
 *
 * @param {Array<Record<string, any>>} tableData - 表格数据数组或Vue ref
 * @param {string} key - 需要处理的字段名
 * @returns {Array<Record<string, any>>} 处理后的表格数据数组
 *
 * @example
 * ```ts
 * // 基本用法
 * const data = [
 *   { name: 'John&nbsp;Doe', age: 30 },
 *   { name: 'Jane&nbsp;&nbsp;Smith', age: 25 }
 * ]
 * const result = replaceNBSP(data, 'name')
 * // 结果: [
 * //   { name: 'John  Doe', age: 30 },
 * //   { name: 'Jane    Smith', age: 25 }
 * // ]
 *
 * // 使用ref包装的数据 (在Vue中使用)
 * const refData = ref([
 *   { desc: 'Product&nbsp;Info', price: 99 },
 *   { desc: 'Service&nbsp;&nbsp;Details', price: 50 }
 * ])
 * const result = replaceNBSP(refData, 'desc')
 * // 结果: [
 * //   { desc: 'Product  Info', price: 99 },
 * //   { desc: 'Service    Details', price: 50 }
 * // ]
 *
 * // 空数组情况
 * const emptyData = []
 * const result = replaceNBSP(emptyData, 'name')
 * // 结果: []
 * ```
 */
export function replaceNBSP<T extends Record<string, string | number | boolean | object>>(
  tableData: T[] | { value: T[] },
  key: string,
): T[] {
  // 如果是 ref 对象，获取其 value
  const unwrappedData = Array.isArray(tableData) ? tableData : tableData.value

  if (unwrappedData.length) {
    return unwrappedData.map((item) => {
      if (typeof item[key] === 'string') {
        // 创建一个新对象，不修改原对象
        return {
          ...item,
          [key]: (item[key] as string).replace(/&nbsp;/g, '\u00A0\u00A0'),
        }
      }
      return item
    })
  }

  return []
}
