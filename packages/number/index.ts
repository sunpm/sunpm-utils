/**
 * @module 数字处理
 * @description 提供各种数字处理函数，包括数字格式化、计算、范围控制等实用功能
 */

function getDecimalString(value: unknown): string | undefined {
  if (typeof value === 'number')
    return Number.isFinite(value) ? String(value) : undefined
  if (typeof value !== 'string')
    return undefined

  const text = value.trim()
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text) ? text : undefined
}

/**
 * 去掉小数末尾多余的零，始终返回字符串
 * 字符串不经过 Number 转换，保留精度、正负号和整数部分的前导零。
 * 支持科学计数法，仅清理尾数的小数零，保留指数部分。
 * @param value 数字或十进制数字字符串，自动去除首尾空白
 * @returns 清理后的字符串；空值、非有限数字或无效输入返回空字符串
 * @group Number
 * @example
 * ```ts
 * trimDecimalZeros('12.00') // '12'
 * trimDecimalZeros('12.50') // '12.5'
 * trimDecimalZeros('9007199254740993.0100') // '9007199254740993.01'
 * trimDecimalZeros('1.200e+3') // '1.2e+3'
 * trimDecimalZeros(null) // ''
 * ```
 */
export function trimDecimalZeros(value: unknown): string {
  const text = getDecimalString(value)
  if (text === undefined)
    return ''

  const pointIndex = text.indexOf('.')
  if (pointIndex === -1)
    return text

  const exponentIndex = text.search(/e/i)
  const mantissaEnd = exponentIndex === -1 ? text.length : exponentIndex
  let end = mantissaEnd
  while (end > pointIndex + 1 && text[end - 1] === '0')
    end--
  if (end === pointIndex + 1)
    end = pointIndex

  let result = text.slice(0, end)
  if (result === '' || result === '+' || result === '-')
    result += '0'
  return result + text.slice(mantissaEnd)
}

/**
 * 判断数字或十进制数字字符串是否为零，支持科学计数法
 * 直接检查字符串尾数，避免极小的非零值转成 Number 后被误判为零。
 * @param value 待判断的值，字符串自动去除首尾空白
 * @returns 零和负零返回 true；空值、无效输入和非零值返回 false
 * @group Number
 * @example
 * ```ts
 * isZero(0) // true
 * isZero('-0.00') // true
 * isZero('0.00e+3') // true
 * isZero('1e-400') // false
 * isZero('') // false
 * isZero(null) // false
 * ```
 */
export function isZero(value: unknown): boolean {
  if (typeof value === 'number')
    return value === 0

  const text = getDecimalString(value)
  if (text === undefined)
    return false

  const exponentIndex = text.search(/e/i)
  const mantissa = exponentIndex === -1 ? text : text.slice(0, exponentIndex)
  return !/[1-9]/.test(mantissa)
}

/**
 * 将数字或十进制数字字符串转换为有限 number，支持科学计数法
 * 不接受布尔值、对象、进制前缀、千位分隔符或带单位的字符串。
 * 转换遵循 JavaScript number 的精度规则；需要保留原始精度时使用字符串。
 * @param value 待转换的值，字符串自动去除首尾空白
 * @param defaultValue 空值、无效输入或溢出时的返回值，默认为 undefined；可传入数字或 null
 * @returns 转换后的数字或指定的兜底值，返回类型随兜底值推导
 * @group Number
 * @example
 * ```ts
 * toNumber('12.00') // 12
 * toNumber('12.50') // 12.5
 * toNumber('') // undefined，保留输入框的空状态
 * toNumber(null, 0) // 0，返回类型为 number
 * toNumber('', null) // null，返回类型为 number | null
 * toNumber('12px') // undefined
 * ```
 */
export function toNumber(value: unknown, defaultValue?: undefined): number | undefined
export function toNumber<T extends number | null | undefined>(value: unknown, defaultValue: T): number | T
export function toNumber(value: unknown, defaultValue?: number | null): number | null | undefined {
  if (typeof value === 'number')
    return Number.isFinite(value) ? value : defaultValue

  const text = getDecimalString(value)
  if (text === undefined)
    return defaultValue

  const num = Number(text)
  return Number.isFinite(num) ? num : defaultValue
}

/**
 * 将数字四舍五入到指定小数位
 * @param num 要处理的数字
 * @param precision 小数位数，默认为0（整数）
 * @returns 四舍五入后的数字
 * @group Number
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
 * @group Number
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
 * @param value 要格式化的数字，支持 number 或数字字符串（如 '1234.56'）
 * @param options 格式化选项
 * @param options.currency 货币代码（如 'CNY', 'USD'），默认为 'CNY'
 * @param options.locale 地区设置（如 'zh-CN', 'en-US'），默认为 'zh-CN'
 * @param options.minimumFractionDigits 最小小数位数，默认为 2
 * @param options.maximumFractionDigits 最大小数位数，默认为 2
 * @param options.showSymbol 是否显示货币符号，默认为 true
 * @returns 格式化后的货币字符串
 * @group Number
 * @example
 * ```ts
 * formatCurrency(1234.56) // '¥1,234.56'
 * formatCurrency(1234.56, { currency: 'USD', locale: 'en-US' }) // '$1,234.56'
 * formatCurrency(1234.56789, { maximumFractionDigits: 4 }) // '¥1,234.5679'
 * formatCurrency(1234, { minimumFractionDigits: 0 }) // '¥1,234'
 * formatCurrency('1234.56') // '¥1,234.56'，支持数字字符串
 * formatCurrency(1234.56, { showSymbol: false }) // '1,234.56'
 * ```
 */
export function formatCurrency(
  value: number | string,
  options: {
    currency?: string
    locale?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    showSymbol?: boolean
  } = {},
): string {
  const {
    currency = 'CNY',
    locale = 'zh-CN',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSymbol = true,
  } = options

  const num = Number(value)
  if (!Number.isFinite(num))
    return ''

  return new Intl.NumberFormat(locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num)
}

/**
 * 确保数字在指定范围内
 * @param num 要限制范围的数字
 * @param min 最小值
 * @param max 最大值
 * @returns 在指定范围内的数字：如果小于最小值返回最小值，如果大于最大值返回最大值
 * @group Number
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
 * @group Number
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
 * @group Number
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
 * @group Number
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
 * @group Number
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
 * @group Number
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
