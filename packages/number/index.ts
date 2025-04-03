/**
 * @module 数字处理
 * @description 提供各种数字处理函数，包括数字格式化、计算、范围控制等实用功能
 */

/**
 * 将数字四舍五入到指定小数位
 * @param num 要处理的数字
 * @param precision 小数位数，默认为0（整数）
 * @returns 四舍五入后的数字
 * @example
 * ```ts
 * round(3.1415) // 3
 * round(3.1415, 2) // 3.14
 * round(3.1415, 3) // 3.142
 * round(3.9999) // 4
 * ```
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
 * @example
 * ```ts
 * formatThousands(1234567) // '1,234,567'（根据浏览器默认区域可能有所不同）
 * formatThousands(1234567.89, 'en-US') // '1,234,567.89'
 * formatThousands(1234567.89, 'de-DE') // '1.234.567,89'
 * ```
 */
export function formatThousands(num: number, locale?: string): string {
  return num.toLocaleString(locale)
}

/**
 * 将数字格式化为货币字符串
 * @param value 要格式化的数字
 * @param options 格式化选项
 * @param options.currency 货币代码（如 'CNY', 'USD'），默认为 'CNY'
 * @param options.locale 地区设置（如 'zh-CN', 'en-US'），默认为 'zh-CN'
 * @param options.minimumFractionDigits 最小小数位数，默认为 2
 * @param options.maximumFractionDigits 最大小数位数，默认为 2
 * @returns 格式化后的货币字符串
 * @example
 * ```ts
 * formatCurrency(1234.56) // '¥1,234.56'
 * formatCurrency(1234.56, { currency: 'USD', locale: 'en-US' }) // '$1,234.56'
 * formatCurrency(1234.56789, { maximumFractionDigits: 4 }) // '¥1,234.5679'
 * formatCurrency(1234, { minimumFractionDigits: 0 }) // '¥1,234'
 * ```
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
 * @param num 要限制范围的数字
 * @param min 最小值
 * @param max 最大值
 * @returns 在指定范围内的数字：如果小于最小值返回最小值，如果大于最大值返回最大值
 * @example
 * ```ts
 * clamp(5, 0, 10) // 5 - 在范围内，保持不变
 * clamp(-5, 0, 10) // 0 - 小于最小值，返回最小值
 * clamp(15, 0, 10) // 10 - 大于最大值，返回最大值
 * ```
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

/**
 * 生成指定范围内的随机整数（包含边界值）
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 指定范围内的随机整数
 * @example
 * ```ts
 * randomInt(1, 10) // 返回 1 到 10 之间的随机整数，包括 1 和 10
 * randomInt(0, 1) // 返回 0 或 1
 * randomInt(5, 5) // 总是返回 5
 * ```
 */
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 检查一个数字是否为偶数
 * @param num 要检查的数字
 * @returns 如果是偶数则返回 true，否则返回 false
 * @example
 * ```ts
 * isEven(2) // true
 * isEven(3) // false
 * isEven(0) // true
 * isEven(-4) // true
 * ```
 */
export function isEven(num: number): boolean {
  return num % 2 === 0
}

/**
 * 检查一个数字是否为奇数
 * @param num 要检查的数字
 * @returns 如果是奇数则返回 true，否则返回 false
 * @example
 * ```ts
 * isOdd(3) // true
 * isOdd(2) // false
 * isOdd(0) // false
 * isOdd(-3) // true
 * ```
 */
export function isOdd(num: number): boolean {
  return !isEven(num)
}

/**
 * 计算百分比值
 * @param value 当前值
 * @param total 总值
 * @param precision 结果保留的小数位数，默认为2
 * @returns 百分比值，如果总值为零则返回 0
 * @example
 * ```ts
 * percentage(25, 100) // 25
 * percentage(1, 3) // 33.33
 * percentage(1, 3, 0) // 33
 * percentage(5, 0) // 0，避免除以零错误
 * ```
 */
export function percentage(value: number, total: number, precision = 2): number {
  if (total === 0)
    return 0
  return round((value / total) * 100, precision)
}

/**
 * 将数值转换为带"万"单位的字符串
 * @param num 要转换的数值
 * @param fractionDigits 小数位数，默认为2
 * @returns 转换后的字符串，如果值大于等于10000则转为"万"单位
 * @example
 * ```ts
 * formatNumberWithTenThousand(1234) // '1234'
 * formatNumberWithTenThousand(12345) // '1.23万'
 * formatNumberWithTenThousand(12345, 1) // '1.2万'
 * formatNumberWithTenThousand(0) // '0'
 * ```
 */
export function formatNumberWithTenThousand(num: number, fractionDigits = 2): string {
  if (!num) {
    return '0'
  }
  if (num >= 10000) {
    // 保留两位小数
    return `${(num / 10000).toFixed(fractionDigits)}万`
  }
  else {
    return num.toString()
  }
}
