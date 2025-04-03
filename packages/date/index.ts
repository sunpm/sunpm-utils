import type { Dayjs, ManipulateType, OpUnitType, QUnitType } from 'dayjs'
/**
 * @module 日期时间
 * @description 提供各种日期时间处理函数，包括日期格式化、日期计算、比较等实用功能。基于 dayjs 库实现。
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
 * @example
 * ```ts
 * createDate() // 当前日期时间
 * createDate('2023-05-15') // 指定日期
 * createDate(1684123456000) // 时间戳
 * ```
 */
export function createDate(date?: string | number | Date | Dayjs): Dayjs {
  return dayjs(date)
}

/**
 * 格式化日期为指定格式的字符串
 * @param date 日期对象、时间戳或日期字符串
 * @param format 格式字符串，支持的占位符请参考 dayjs 文档
 * @returns 格式化后的日期字符串
 * @example
 * ```ts
 * formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss') // "2023-05-16 14:30:45"
 * formatDate('2023-05-15', 'YYYY年MM月DD日') // "2023年05月15日"
 * formatDate(1684123456000, 'MM/DD/YYYY') // "05/15/2023"
 * ```
 */
export function formatDate(date: Date | string | number, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

/**
 * 获取当前日期时间的时间戳
 * @returns 当前时间戳（毫秒）
 * @example
 * ```ts
 * now() // 例如: 1684123456789
 * ```
 */
export function now(): number {
  return Date.now()
}

/**
 * 解析日期字符串为日期对象
 * @param dateStr 日期字符串
 * @returns 日期对象
 * @throws 如果日期格式无效，抛出 TypeError
 * @example
 * ```ts
 * parseDate('2023-05-15') // Date 对象: Mon May 15 2023 00:00:00
 * parseDate('2023/05/15 14:30:45') // Date 对象: Mon May 15 2023 14:30:45
 * parseDate('invalid date') // 抛出 TypeError: 无效的日期格式
 * ```
 */
export function parseDate(dateStr: string): Date {
  const d = dayjs(dateStr)
  if (!d.isValid())
    throw new TypeError('无效的日期格式')
  return d.toDate()
}

/**
 * 计算两个日期之间的差异
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @param unit 计量单位，默认为 'day'，可以是 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'
 * @returns 两个日期之间的差值，正数表示 date1 晚于 date2，负数表示 date1 早于 date2
 * @example
 * ```ts
 * diff('2023-05-15', '2023-05-10') // 5（相差5天）
 * diff('2023-05-15', '2023-06-15', 'month') // -1（相差1个月，且第一个日期早于第二个）
 * diff('2023-05-15 08:00', '2023-05-15 06:00', 'hour') // 2（相差2小时）
 * ```
 */
export function diff(date1: Date | string | number, date2: Date | string | number, unit: QUnitType | OpUnitType = 'day'): number {
  return dayjs(date1).diff(dayjs(date2), unit)
}

/**
 * 向日期添加指定时间
 * @param date 原始日期
 * @param amount 要添加的数量，可以为负数
 * @param unit 时间单位，默认为 'day'，可以是 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'
 * @returns 添加后的新日期对象
 * @example
 * ```ts
 * add(new Date('2023-05-15'), 2, 'day') // Date 对象: Wed May 17 2023
 * add('2023-05-15', -1, 'month') // Date 对象: Sat Apr 15 2023
 * add('2023-05-15 12:00', 30, 'minute') // Date 对象: Mon May 15 2023 12:30:00
 * ```
 */
export function add(date: Date | string | number, amount: number, unit: ManipulateType = 'day'): Date {
  return dayjs(date).add(amount, unit).toDate()
}

/**
 * 向日期添加指定天数
 * @param date 原始日期
 * @param days 要添加的天数（可以为负数）
 * @returns 添加天数后的新日期对象
 * @example
 * ```ts
 * addDays(new Date('2023-05-15'), 5) // Date 对象: Sat May 20 2023
 * addDays('2023-05-15', -3) // Date 对象: Fri May 12 2023
 * ```
 */
export function addDays(date: Date | string | number, days: number): Date {
  return add(date, days, 'day')
}

/**
 * 向日期添加指定月数
 * @param date 原始日期
 * @param months 要添加的月数（可以为负数）
 * @returns 添加月数后的新日期对象
 * @example
 * ```ts
 * addMonths(new Date('2023-05-15'), 2) // Date 对象: Sat Jul 15 2023
 * addMonths('2023-05-31', 1) // Date 对象: Fri Jun 30 2023（注意月份天数自动调整）
 * addMonths('2023-01-15', -3) // Date 对象: Wed Oct 15 2022
 * ```
 */
export function addMonths(date: Date | string | number, months: number): Date {
  return add(date, months, 'month')
}

/**
 * 向日期添加指定年数
 * @param date 原始日期
 * @param years 要添加的年数（可以为负数）
 * @returns 添加年数后的新日期对象
 * @example
 * ```ts
 * addYears(new Date('2023-05-15'), 1) // Date 对象: Wed May 15 2024
 * addYears('2023-05-15', -3) // Date 对象: Fri May 15 2020
 * addYears('2024-02-29', 1) // Date 对象: Fri Feb 28 2025（注意闰年自动调整）
 * ```
 */
export function addYears(date: Date | string | number, years: number): Date {
  return add(date, years, 'year')
}

/**
 * 获取指定日期是一周中的第几天
 * @param date 日期
 * @param startOnMonday 是否从周一开始计算（默认为 false，即从周日开始）
 * @returns 一周中的第几天（0-6），周日为 0，周六为 6；如果 startOnMonday 为 true，则周一为 0，周日为 6
 * @example
 * ```ts
 * getDayOfWeek(new Date('2023-05-15')) // 1（周一，从周日开始算是第1天）
 * getDayOfWeek('2023-05-15', true) // 0（周一，从周一开始算是第0天）
 * getDayOfWeek('2023-05-14') // 0（周日，从周日开始算是第0天）
 * getDayOfWeek('2023-05-14', true) // 6（周日，从周一开始算是第6天）
 * ```
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
 * @returns 如果日期在指定范围内（不包括边界）则返回 true，否则返回 false
 * @example
 * ```ts
 * isDateInRange('2023-05-15', '2023-05-10', '2023-05-20') // true
 * isDateInRange('2023-05-15', '2023-05-15', '2023-05-20') // false（不包括开始日期）
 * isDateInRange('2023-05-15', '2023-05-10', '2023-05-15') // false（不包括结束日期）
 * ```
 */
export function isDateInRange(date: Date | string | number, startDate: Date | string | number, endDate: Date | string | number): boolean {
  const d = dayjs(date)
  return d.isAfter(dayjs(startDate)) && d.isBefore(dayjs(endDate))
}

/**
 * 获取指定月份的天数
 * @param year 年份
 * @param month 月份（0-11），0 表示一月，11 表示十二月
 * @returns 该月的天数
 * @example
 * ```ts
 * getDaysInMonth(2023, 1) // 28（2023年2月有28天）
 * getDaysInMonth(2024, 1) // 29（2024年2月有29天，闰年）
 * getDaysInMonth(2023, 0) // 31（2023年1月有31天）
 * ```
 */
export function getDaysInMonth(year: number, month: number): number {
  return dayjs(new Date(year, month, 1)).daysInMonth()
}

/**
 * 获取相对时间描述
 * @param date 日期
 * @param baseDate 基准日期，默认为当前时间
 * @returns 相对时间描述，如"几分钟前"、"几天后"等
 * @example
 * ```ts
 * fromNow(new Date(Date.now() - 5 * 60 * 1000)) // "5分钟前"
 * fromNow(new Date(Date.now() + 24 * 60 * 60 * 1000)) // "1天后"
 * fromNow('2023-01-01', '2023-01-05') // "4天前"
 * ```
 */
export function fromNow(date: Date | string | number, baseDate?: Date | string | number): string {
  if (baseDate)
    return dayjs(date).from(dayjs(baseDate))
  return dayjs(date).fromNow()
}

/**
 * 获取日期的开始时间
 * @param date 日期
 * @param unit 单位，可以是 'year', 'month', 'week', 'day', 'hour', 'minute', 'second'
 * @returns 单位开始时间的日期对象
 * @example
 * ```ts
 * startOf(new Date('2023-05-15 15:30:45'), 'day') // Date 对象: Mon May 15 2023 00:00:00
 * startOf('2023-05-15 15:30:45', 'month') // Date 对象: Mon May 01 2023 00:00:00
 * startOf('2023-05-15 15:30:45', 'hour') // Date 对象: Mon May 15 2023 15:00:00
 * ```
 */
export function startOf(date: Date | string | number, unit: OpUnitType): Date {
  return dayjs(date).startOf(unit).toDate()
}

/**
 * 获取日期的结束时间
 * @param date 日期
 * @param unit 单位，可以是 'year', 'month', 'week', 'day', 'hour', 'minute', 'second'
 * @returns 单位结束时间的日期对象
 * @example
 * ```ts
 * endOf(new Date('2023-05-15 15:30:45'), 'day') // Date 对象: Mon May 15 2023 23:59:59.999
 * endOf('2023-05-15 15:30:45', 'month') // Date 对象: Wed May 31 2023 23:59:59.999
 * endOf('2023-05-15 15:30:45', 'hour') // Date 对象: Mon May 15 2023 15:59:59.999
 * ```
 */
export function endOf(date: Date | string | number, unit: OpUnitType): Date {
  return dayjs(date).endOf(unit).toDate()
}

/**
 * 格式化日期为人类友好的格式
 * @param date 日期
 * @returns 人类友好的日期描述，如"今天 HH:mm"、"昨天 HH:mm"、"明天 HH:mm"或"YYYY-MM-DD HH:mm"
 * @example
 * ```ts
 * formatHumanReadable(new Date()) // "今天 15:30"
 * formatHumanReadable(new Date(Date.now() - 24 * 60 * 60 * 1000)) // "昨天 15:30"
 * formatHumanReadable(new Date(Date.now() + 24 * 60 * 60 * 1000)) // "明天 15:30"
 * formatHumanReadable('2023-01-01') // "2023-01-01 00:00"
 * ```
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
