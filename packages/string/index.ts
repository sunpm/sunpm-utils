/**
 * 字符串操作相关的工具函数
 */

import { isNaN } from '../is'

/**
 * 将字符串首字母转为大写
 * @param str 输入字符串
 * @returns 首字母大写后的字符串
 */
export function capitalize(str: string): string {
  if (str.length === 0)
    return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 将驼峰命名转换为短横线命名
 * @param str 驼峰命名的字符串
 * @returns 短横线命名的字符串
 * @example camelToKebab('helloWorld') => 'hello-world'
 */
export function camelToKebab(str: string): string {
  // 处理首字母大写的情况，如 APIVersion -> api-version
  return str
    .replace(/([A-Z])([A-Z]+)([A-Z])/g, '$1$2-$3') // 处理连续大写字母
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * 将短横线命名转换为驼峰命名
 * @param str 短横线命名的字符串
 * @returns 驼峰命名的字符串
 * @example kebabToCamel('hello-world') => 'helloWorld'
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

/**
 * 截取字符串并添加省略号
 * @param str 原始字符串
 * @param length 截取长度
 * @param ellipsis 省略号字符，默认为'...'
 * @returns 截取后的字符串
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
 * @param chars 可选的字符集，默认包含字母和数字
 * @returns 随机字符串
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
 * 将字符串中的 HTML 特殊字符转义
 * @param html 包含 HTML 的字符串
 * @returns 转义后的字符串
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
 * @param url URL 字符串
 * @returns 是否为有效 URL
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
 * @param email 电子邮件地址
 * @returns 是否为有效电子邮件
 */
export function isValidEmail(email: string): boolean {
  const re = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
  return re.test(email)
}

/**
 * 检查字符串是否为空
 * @param str - 要检查的字符串
 * @returns 如果字符串为空或只包含空白字符，则返回 true
 */
export function isEmptyString(str: string): boolean {
  return str.trim().length === 0
}

/**
 * 转为兼容 rpx 格式样式值
 * @param val - 需要转化的值
 * @returns 转化后 rpx 值
 */
export function ensureRpxUnit(val: string | number): string {
  const str = Number(val)
  if (isNaN(str)) {
    return val as string
  }
  return `${val}rpx`
}
