/**
 * 日期时间相关的工具函数
 */

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式字符串，支持的占位符包括:
 *  - YYYY: 四位年份
 *  - MM: 两位月份
 *  - DD: 两位日期
 *  - HH: 两位小时（24小时制）
 *  - mm: 两位分钟
 *  - ss: 两位秒数
 *  - SSS: 三位毫秒数
 * @returns 格式化后的日期字符串
 * @example formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss') // "2023-05-16 14:30:45"
 */
export function formatDate(date: Date | number, format = 'YYYY-MM-DD'): string {
  const d = new Date(date)

  const replacements: Record<string, () => string> = {
    YYYY: () => String(d.getFullYear()),
    MM: () => String(d.getMonth() + 1).padStart(2, '0'),
    DD: () => String(d.getDate()).padStart(2, '0'),
    HH: () => String(d.getHours()).padStart(2, '0'),
    mm: () => String(d.getMinutes()).padStart(2, '0'),
    ss: () => String(d.getSeconds()).padStart(2, '0'),
    SSS: () => String(d.getMilliseconds()).padStart(3, '0'),
  }

  return format.replace(/YYYY|MM|DD|HH|mm|ss|SSS/g, (match) => {
    const replaceFn = replacements[match]
    return replaceFn ? replaceFn() : match
  })
}

/**
 * 获取当前日期时间的时间戳
 * @returns 当前时间戳（毫秒）
 */
export function now(): number {
  return Date.now()
}

/**
 * 解析日期字符串为日期对象
 * @param dateStr 日期字符串
 * @returns 日期对象
 */
export function parseDate(dateStr: string): Date {
  if (!dateStr) {
    throw new TypeError('日期字符串不能为空')
  }

  // 尝试自动解析
  const date = new Date(dateStr)

  // 检查日期是否有效
  if (Number.isNaN(date.getTime())) {
    throw new TypeError('无效的日期格式')
  }

  return date
}

/**
 * 获取两个日期之间的差异（天数）
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @returns 两个日期之间的天数差
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒数
  const d1 = new Date(date1)
  const d2 = new Date(date2)

  // 重置时间部分，只比较日期部分
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)

  return Math.round(Math.abs((d1.getTime() - d2.getTime()) / oneDay))
}

/**
 * 向日期添加指定天数
 * @param date 原始日期
 * @param days 要添加的天数（可以为负数）
 * @returns 添加天数后的新日期
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * 向日期添加指定月数
 * @param date 原始日期
 * @param months 要添加的月数（可以为负数）
 * @returns 添加月数后的新日期
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

/**
 * 向日期添加指定年数
 * @param date 原始日期
 * @param years 要添加的年数（可以为负数）
 * @returns 添加年数后的新日期
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() + years)
  return result
}

/**
 * 获取指定日期是一周中的第几天
 * @param date 日期
 * @param startOnMonday 是否从周一开始计算（默认为 false，即从周日开始）
 * @returns 一周中的第几天（0-6）
 */
export function getDayOfWeek(date: Date, startOnMonday = false): number {
  let day = date.getDay()
  if (startOnMonday) {
    day = day === 0 ? 6 : day - 1
  }
  return day
}

/**
 * 检查日期是否在指定范围内
 * @param date 要检查的日期
 * @param startDate 范围起始日期
 * @param endDate 范围结束日期
 * @returns 日期是否在范围内
 */
export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  const d = date.getTime()
  return d >= startDate.getTime() && d <= endDate.getTime()
}

/**
 * 获取指定月份的天数
 * @param year 年份
 * @param month 月份（0-11）
 * @returns 天数
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}
