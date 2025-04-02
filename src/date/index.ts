import type { Dayjs, ManipulateType, OpUnitType, QUnitType } from 'dayjs'
/**
 * 日期时间相关的工具函数
 */
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'

// 注册插件
dayjs.extend(relativeTime)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)

// 可以按需导入更多插件
// import weekOfYear from 'dayjs/plugin/weekOfYear'
// import isLeapYear from 'dayjs/plugin/isLeapYear'
// import customParseFormat from 'dayjs/plugin/customParseFormat'
// dayjs.extend(weekOfYear)
// dayjs.extend(isLeapYear)
// dayjs.extend(customParseFormat)

/**
 * 创建 dayjs 对象
 * @param date 日期参数，可以是日期对象、时间戳或日期字符串
 * @returns dayjs 对象
 */
export function createDate(date?: string | number | Date | Dayjs): Dayjs {
  return dayjs(date)
}

/**
 * 格式化日期
 * @param date 日期对象、时间戳或日期字符串
 * @param format 格式字符串，支持的占位符请参考 dayjs 文档
 * @returns 格式化后的日期字符串
 * @example formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss') // "2023-05-16 14:30:45"
 */
export function formatDate(date: Date | string | number, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
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
  const d = dayjs(dateStr)
  if (!d.isValid())
    throw new TypeError('无效的日期格式')
  return d.toDate()
}

/**
 * 获取两个日期之间的差异
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @param unit 计量单位，默认为 'day'
 * @returns 两个日期之间的差值
 */
export function diff(date1: Date | string | number, date2: Date | string | number, unit: QUnitType | OpUnitType = 'day'): number {
  return dayjs(date1).diff(dayjs(date2), unit)
}

/**
 * 向日期添加指定时间
 * @param date 原始日期
 * @param amount 要添加的数量
 * @param unit 时间单位
 * @returns 添加后的新日期
 */
export function add(date: Date | string | number, amount: number, unit: ManipulateType = 'day'): Date {
  return dayjs(date).add(amount, unit).toDate()
}

/**
 * 向日期添加指定天数
 * @param date 原始日期
 * @param days 要添加的天数（可以为负数）
 * @returns 添加天数后的新日期
 */
export function addDays(date: Date | string | number, days: number): Date {
  return add(date, days, 'day')
}

/**
 * 向日期添加指定月数
 * @param date 原始日期
 * @param months 要添加的月数（可以为负数）
 * @returns 添加月数后的新日期
 */
export function addMonths(date: Date | string | number, months: number): Date {
  return add(date, months, 'month')
}

/**
 * 向日期添加指定年数
 * @param date 原始日期
 * @param years 要添加的年数（可以为负数）
 * @returns 添加年数后的新日期
 */
export function addYears(date: Date | string | number, years: number): Date {
  return add(date, years, 'year')
}

/**
 * 获取指定日期是一周中的第几天
 * @param date 日期
 * @param startOnMonday 是否从周一开始计算（默认为 false，即从周日开始）
 * @returns 一周中的第几天（0-6）
 */
export function getDayOfWeek(date: Date | string | number, startOnMonday = false): number {
  const d = dayjs(date)
  const day = d.day()
  if (startOnMonday) {
    return day === 0 ? 6 : day - 1
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
export function isDateInRange(date: Date | string | number, startDate: Date | string | number, endDate: Date | string | number): boolean {
  const d = dayjs(date)
  return d.isAfter(dayjs(startDate)) && d.isBefore(dayjs(endDate))
}

/**
 * 获取指定月份的天数
 * @param year 年份
 * @param month 月份（0-11）
 * @returns 天数
 */
export function getDaysInMonth(year: number, month: number): number {
  return dayjs(new Date(year, month, 1)).daysInMonth()
}

/**
 * 获取相对时间描述
 * @param date 日期
 * @param baseDate 基准日期，默认为当前时间
 * @returns 相对时间描述，如"几分钟前"、"几天后"等
 */
export function fromNow(date: Date | string | number, baseDate?: Date | string | number): string {
  if (baseDate)
    return dayjs(date).from(dayjs(baseDate))
  return dayjs(date).fromNow()
}

/**
 * 获取日期的开始时间
 * @param date 日期
 * @param unit 单位，如 'day', 'month', 'year' 等
 * @returns 单位开始时间的日期对象
 */
export function startOf(date: Date | string | number, unit: OpUnitType): Date {
  return dayjs(date).startOf(unit).toDate()
}

/**
 * 获取日期的结束时间
 * @param date 日期
 * @param unit 单位，如 'day', 'month', 'year' 等
 * @returns 单位结束时间的日期对象
 */
export function endOf(date: Date | string | number, unit: OpUnitType): Date {
  return dayjs(date).endOf(unit).toDate()
}

/**
 * 格式化日期为人类友好的格式
 * @param date 日期
 * @returns 人类友好的日期描述
 */
export function formatHumanReadable(date: Date | string | number): string {
  const d = dayjs(date)
  const now = dayjs()

  if (d.isSame(now, 'day'))
    return `今天 ${d.format('HH:mm')}`
  if (d.isSame(now.subtract(1, 'day'), 'day'))
    return `昨天 ${d.format('HH:mm')}`
  if (d.isSame(now.add(1, 'day'), 'day'))
    return `明天 ${d.format('HH:mm')}`
  if (d.isSame(now, 'year'))
    return d.format('M月D日 HH:mm')
  return d.format('YYYY年M月D日 HH:mm')
}
