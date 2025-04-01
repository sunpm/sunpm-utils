/**
 * 数字操作相关的工具函数
 */

/**
 * 将数字四舍五入到指定小数位
 * @param num 要处理的数字
 * @param precision 小数位数，默认为0（整数）
 * @returns 四舍五入后的数字
 */
export function round(num: number, precision = 0): number {
  const factor = 10 ** precision
  return Math.round(num * factor) / factor
}

/**
 * 将数字格式化为带千位分隔符的字符串
 * @param num 要格式化的数字
 * @param locale 区域设置，默认为浏览器默认区域
 * @returns 格式化后的字符串
 */
export function formatThousands(num: number, locale?: string): string {
  return num.toLocaleString(locale)
}

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
export function formatCurrency(
  value: number,
  options: {
    currency?: string
    locale?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  } = {},
): string {
  const {
    currency = 'CNY',
    locale = 'zh-CN',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value)
}

/**
 * 确保数字在指定范围内
 * @param num 要检查的数字
 * @param min 最小值
 * @param max 最大值
 * @returns 在范围内的数字
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

/**
 * 生成指定范围内的随机整数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 随机整数
 */
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 检查一个数字是否为偶数
 * @param num 要检查的数字
 * @returns 是否为偶数
 */
export function isEven(num: number): boolean {
  return num % 2 === 0
}

/**
 * 检查一个数字是否为奇数
 * @param num 要检查的数字
 * @returns 是否为奇数
 */
export function isOdd(num: number): boolean {
  return !isEven(num)
}

/**
 * 计算百分比
 * @param value 当前值
 * @param total 总值
 * @param precision 精度，默认为2
 * @returns 百分比值
 */
export function percentage(value: number, total: number, precision = 2): number {
  if (total === 0)
    return 0
  return round((value / total) * 100, precision)
}
