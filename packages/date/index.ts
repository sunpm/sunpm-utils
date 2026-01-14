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
import { isNaN, isNumber } from '../is'

// 导入本地化语言
import 'dayjs/locale/zh-cn'

// 设置全局语言为中文
dayjs.locale('zh-cn')

/**
 * 表示日期的各种类型，可以是日期对象、日期字符串或时间戳
 */
export type DateLike = Date | string | number | undefined

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
 * @group Date
 * @example
 * ```ts
 * createDate() // 当前日期时间
 * createDate('2023-05-15') // 指定日期
 * createDate(1684123456000) // 时间戳
 * ```
 */
export function createDate(date?: DateLike | Dayjs): Dayjs {
  return dayjs(date)
}

/**
 * 判断时间戳是否为毫秒级时间戳
 * @param value 要检查的值
 * @returns 如果是毫秒级时间戳则返回 true，否则返回 false
 * @group Date
 * @example
 * ```ts
 * isMillisecondTimestamp(1673740800000) // true，13位数字
 * isMillisecondTimestamp(1673740800) // false，10位数字，秒级时间戳
 * isMillisecondTimestamp('1673740800000') // false, 字符串不是时间戳
 * isMillisecondTimestamp(new Date()) // false，日期对象不是时间戳
 * ```
 */
export function isMillisecondTimestamp(value: unknown): boolean {
  if (!isNumber(value) || value.toString().length !== 13)
    return false

  const date = new Date(value)
  return !isNaN(date.getTime())
}

/**
 * 转换为 dayjs 可接收的参数格式
 * @param value 日期参数，可以是日期对象、时间戳（秒或毫秒）或日期字符串
 * @returns 转换后的参数，如果是秒级时间戳则转为毫秒级，其他类型保持不变
 * @group Date
 * @example
 * ```ts
 * convertToDayjsParam(1673740800) // 1673740800000，秒转为毫秒
 * convertToDayjsParam(1673740800000) // 1673740800000，毫秒保持不变
 * convertToDayjsParam(new Date()) // Date对象，保持不变
 * convertToDayjsParam('2023-01-15') // '2023-01-15'，字符串保持不变
 * ```
 */
export function convertToDayjsParam(value: DateLike) {
  // 如果已经是毫秒级时间戳，直接返回
  if (isMillisecondTimestamp(value)) {
    return value
  }

  // 如果是数字且是10位数字，则可能是秒级时间戳，需要转为毫秒
  if (isNumber(value) && String(value).length === 10) {
    return value * 1000
  }

  return value
}

/**
 * 格式化日期为指定格式的字符串
 * @param date 日期对象、时间戳或日期字符串
 * @param format 格式字符串，支持的占位符请参考 [dayjs 文档](https://day.js.org/docs/zh-CN/durations/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)
 * @returns 格式化后的日期字符串
 * @group Date
 * @example
 * ```ts
 * formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss') // "2023-05-16 14:30:45"
 * formatDate('2023-05-15', 'YYYY年MM月DD日') // "2023年05月15日"
 * formatDate(1684123456000, 'MM/DD/YYYY') // "05/15/2023"
 * ```
 */
export function formatDate(date: DateLike, format = 'YYYY-MM-DD'): string {
  if (!date)
    return ''
  return dayjs(convertToDayjsParam(date)).format(format)
}

/**
 * 将日期格式化为完整的时间字符串（YYYY-MM-DD HH:mm:ss）
 * @param date 日期对象、时间戳或日期字符串
 * @returns 格式为 YYYY-MM-DD HH:mm:ss 的日期时间字符串
 * @group Date
 * @example
 * ```ts
 * formatFullTime(new Date()) // "2023-05-16 14:30:45"
 * formatFullTime('2023-05-15') // "2023-05-15 00:00:00"
 * formatFullTime(1684123456) // "2023-05-15 10:30:56"（秒级时间戳会被自动转换）
 * ```
 */
export function formatFullTime(date: DateLike) {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 获取当前日期时间的时间戳
 * @returns 当前时间戳（毫秒）
 * @group Date
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
 * @group Date
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
 * @group Date
 * @example
 * ```ts
 * diff('2023-05-15', '2023-05-10') // 5（相差5天）
 * diff('2023-05-15', '2023-06-15', 'month') // -1（相差1个月，且第一个日期早于第二个）
 * diff('2023-05-15 08:00', '2023-05-15 06:00', 'hour') // 2（相差2小时）
 * ```
 */
export function diff(date1: DateLike, date2: DateLike, unit: QUnitType | OpUnitType = 'day'): number {
  return dayjs(convertToDayjsParam(date1)).diff(dayjs(convertToDayjsParam(date2)), unit)
}

/**
 * 向日期添加指定时间
 * @param date 原始日期
 * @param amount 要添加的数量，可以为负数
 * @param unit 时间单位，默认为 'day'，可以是 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'
 * @returns 添加后的新日期对象
 * @group Date
 * @example
 * ```ts
 * add(new Date('2023-05-15'), 2, 'day') // Date 对象: Wed May 17 2023
 * add('2023-05-15', -1, 'month') // Date 对象: Sat Apr 15 2023
 * add('2023-05-15 12:00', 30, 'minute') // Date 对象: Mon May 15 2023 12:30:00
 * ```
 */
export function add(date: DateLike, amount: number, unit: ManipulateType = 'day'): Date {
  return dayjs(convertToDayjsParam(date)).add(amount, unit).toDate()
}

/**
 * 向日期添加指定天数
 * @param date 原始日期
 * @param days 要添加的天数（可以为负数）
 * @returns 添加天数后的新日期对象
 * @group Date
 * @example
 * ```ts
 * addDays(new Date('2023-05-15'), 5) // Date 对象: Sat May 20 2023
 * addDays('2023-05-15', -3) // Date 对象: Fri May 12 2023
 * ```
 */
export function addDays(date: DateLike, days: number): Date {
  return add(convertToDayjsParam(date), days, 'day')
}

/**
 * 向日期添加指定月数
 * @param date 原始日期
 * @param months 要添加的月数（可以为负数）
 * @returns 添加月数后的新日期对象
 * @group Date
 * @example
 * ```ts
 * addMonths(new Date('2023-05-15'), 2) // Date 对象: Sat Jul 15 2023
 * addMonths('2023-05-31', 1) // Date 对象: Fri Jun 30 2023（注意月份天数自动调整）
 * addMonths('2023-01-15', -3) // Date 对象: Wed Oct 15 2022
 * ```
 */
export function addMonths(date: DateLike, months: number): Date {
  return add(convertToDayjsParam(date), months, 'month')
}

/**
 * 向日期添加指定年数
 * @param date 原始日期
 * @param years 要添加的年数（可以为负数）
 * @returns 添加年数后的新日期对象
 * @group Date
 * @example
 * ```ts
 * addYears(new Date('2023-05-15'), 1) // Date 对象: Wed May 15 2024
 * addYears('2023-05-15', -3) // Date 对象: Fri May 15 2020
 * addYears('2024-02-29', 1) // Date 对象: Fri Feb 28 2025（注意闰年自动调整）
 * ```
 */
export function addYears(date: DateLike, years: number): Date {
  return add(convertToDayjsParam(date), years, 'year')
}

/**
 * 获取指定日期是一周中的第几天
 * @param date 日期
 * @param startOnMonday 是否从周一开始计算（默认为 false，即从周日开始）
 * @returns 一周中的第几天（0-6），周日为 0，周六为 6；如果 startOnMonday 为 true，则周一为 0，周日为 6
 * @group Date
 * @example
 * ```ts
 * getDayOfWeek(new Date('2023-05-15')) // 1（周一，从周日开始算是第1天）
 * getDayOfWeek('2023-05-15', true) // 0（周一，从周一开始算是第0天）
 * getDayOfWeek('2023-05-14') // 0（周日，从周日开始算是第0天）
 * getDayOfWeek('2023-05-14', true) // 6（周日，从周一开始算是第6天）
 * ```
 */
export function getDayOfWeek(date: DateLike, startOnMonday = false): number {
  const d = dayjs(convertToDayjsParam(date))
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
 * @group Date
 * @example
 * ```ts
 * isDateInRange('2023-05-15', '2023-05-10', '2023-05-20') // true
 * isDateInRange('2023-05-15', '2023-05-15', '2023-05-20') // false（不包括开始日期）
 * isDateInRange('2023-05-15', '2023-05-10', '2023-05-15') // false（不包括结束日期）
 * ```
 */
export function isDateInRange(date: DateLike, startDate: DateLike, endDate: DateLike): boolean {
  const d = dayjs(convertToDayjsParam(date))
  return d.isAfter(dayjs(convertToDayjsParam(startDate))) && d.isBefore(dayjs(convertToDayjsParam(endDate)))
}

/**
 * 获取指定月份的天数
 * @param year 年份
 * @param month 月份（0-11），0 表示一月，11 表示十二月
 * @returns 该月的天数
 * @group Date
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
 * @group Date
 * @example
 * ```ts
 * fromNow(new Date(Date.now() - 5 * 60 * 1000)) // "5分钟前"
 * fromNow(new Date(Date.now() + 24 * 60 * 60 * 1000)) // "1天内"
 * fromNow('2023-01-01', '2023-01-05') // "4天前"
 * ```
 */
export function fromNow(date: DateLike, baseDate?: DateLike): string {
  date = convertToDayjsParam(date)
  baseDate = baseDate && convertToDayjsParam(baseDate)
  if (baseDate)
    return dayjs(date).from(dayjs(baseDate))
  return dayjs(date).fromNow()
}

/**
 * 获取日期的开始时间
 * @param date 日期
 * @param unit 单位，可以是 'year', 'month', 'week', 'day', 'hour', 'minute', 'second'
 * @returns 单位开始时间的日期对象
 * @group Date
 * @example
 * ```ts
 * startOf(new Date('2023-05-15 15:30:45'), 'day') // Date 对象: Mon May 15 2023 00:00:00
 * startOf('2023-05-15 15:30:45', 'month') // Date 对象: Mon May 01 2023 00:00:00
 * startOf('2023-05-15 15:30:45', 'hour') // Date 对象: Mon May 15 2023 15:00:00
 * ```
 */
export function startOf(date: DateLike, unit: OpUnitType): Date {
  return dayjs(convertToDayjsParam(date)).startOf(unit).toDate()
}

/**
 * 获取日期的结束时间
 * @param date 日期
 * @param unit 单位，可以是 'year', 'month', 'week', 'day', 'hour', 'minute', 'second'
 * @returns 单位结束时间的日期对象
 * @group Date
 * @example
 * ```ts
 * endOf(new Date('2023-05-15 15:30:45'), 'day') // Date 对象: Mon May 15 2023 23:59:59.999
 * endOf('2023-05-15 15:30:45', 'month') // Date 对象: Wed May 31 2023 23:59:59.999
 * endOf('2023-05-15 15:30:45', 'hour') // Date 对象: Mon May 15 2023 15:59:59.999
 * ```
 */
export function endOf(date: DateLike, unit: OpUnitType): Date {
  return dayjs(convertToDayjsParam(date)).endOf(unit).toDate()
}

/**
 * 格式化日期为人类友好的格式
 * @param date 日期
 * @returns 人类友好的日期描述，如"今天 HH:mm"、"昨天 HH:mm"、"明天 HH:mm"或"YYYY-MM-DD HH:mm"
 * @group Date
 * @example
 * ```ts
 * formatHumanReadable(new Date()) // "今天 15:30"
 * formatHumanReadable(new Date(Date.now() - 24 * 60 * 60 * 1000)) // "昨天 15:30"
 * formatHumanReadable(new Date(Date.now() + 24 * 60 * 60 * 1000)) // "明天 15:30"
 * formatHumanReadable('2023-01-01') // "2023-01-01 00:00"
 * ```
 */
export function formatHumanReadable(date: DateLike): string {
  const d = dayjs(convertToDayjsParam(date))
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

/**
 * 格式化日期为聊天列表时间格式（类似微信聊天列表）
 * @param date 日期
 * @returns 格式化后的时间字符串
 * - 当天：HH:mm
 * - 昨天：昨天 HH:mm
 * - 7天内（不包括今天和昨天）：星期几
 * - 今年其他日期：MM月DD日
 * - 往年日期：YYYY年MM月DD日
 * @group Date
 * @example
 * ```ts
 * formatChatTime(new Date()) // "14:30"
 * formatChatTime(new Date(Date.now() - 24 * 60 * 60 * 1000)) // "昨天 09:15"
 * formatChatTime(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)) // "星期三"
 * formatChatTime('2023-05-15') // "05月15日"
 * formatChatTime('2022-12-25') // "2022年12月25日"
 * ```
 */
export function formatChatTime(date: DateLike): string {
  const d = dayjs(convertToDayjsParam(date))
  const now = dayjs()

  // 当天：显示时间
  if (d.isSame(now, 'day')) {
    return d.format('HH:mm')
  }

  // 昨天：显示"昨天 HH:mm"
  if (d.isSame(now.subtract(1, 'day'), 'day')) {
    return `昨天 ${d.format('HH:mm')}`
  }

  // 7天内（不包括今天和昨天）：显示星期几
  const daysDiff = now.diff(d, 'day')
  if (daysDiff >= 2 && daysDiff < 7) {
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    const dayIndex = d.day()
    return weekdays[dayIndex] || '星期日'
  }

  // 今年其他日期：显示MM月DD日
  if (d.isSame(now, 'year')) {
    return d.format('MM月DD日')
  }

  // 往年日期：显示YYYY年MM月DD日
  return d.format('YYYY年MM月DD日')
}

/**
 * 格式化时间戳为时长字符串
 *
 * 支持自定义格式化模板和智能单位显示。如果提供格式化字符串，则按照指定格式返回；
 * 如果不提供，则智能判断显示单位，只显示有意义的时间单位。
 *
 * @param timestamp 时间戳（毫秒）或者持续时间（毫秒）
 * @param format 可选的格式化字符串，支持 YY（年）、MM（月）、DD（天）、HH（小时）、mm（分钟）、ss（秒钟）占位符
 * @returns 格式化后的时长字符串或数字
 * @group Date
 * @example
 * ```ts
 * // 使用自定义格式
 * formatDuration(3661000, 'HH:mm:ss') // "01:01:01"
 * formatDuration(3661000, 'HH时mm分ss秒') // "01时01分01秒"
 * formatDuration(90061000, 'DD天HH时mm分ss秒') // "01天01时01分01秒"
 * formatDuration(2592000000, 'MM月DD天') // "01月00天"
 * formatDuration(31536000000, 'YY年MM月DD天') // "01年00月00天"
 *
 * // 单一格式返回数字（双字母或单字母，支持小数）
 * formatDuration(604800000, 'HH') // 168（总小时数）
 * formatDuration(604800000, 'H') // 168（总小时数）
 * formatDuration(90000, 'mm') // 1.5（总分钟数，支持小数）
 * formatDuration(90000, 'm') // 1.5（总分钟数，支持小数）
 * formatDuration(604800000, 'DD') // 7（总天数）
 * formatDuration(604800000, 'D') // 7（总天数）
 *
 * // 智能格式（只显示有意义的单位）
 * formatDuration(3600000) // "1小时"（正好1小时）
 * formatDuration(3661000) // "1小时1分钟1秒"（1小时1分钟1秒）
 * formatDuration(90061000) // "1天1小时1分钟1秒"（1天1小时1分钟1秒）
 * formatDuration(2592000000) // "1个月"（30天）
 * formatDuration(31536000000) // "1年"（365天）
 * formatDuration(125000) // "2分钟5秒"（2分钟5秒）
 * formatDuration(30000) // "30秒"（30秒）
 * formatDuration(5000) // "5秒"（5秒）
 * formatDuration(0) // "0秒"（0秒）
 *
 * // 处理超大时间值
 * formatDuration(94608000000) // "3年"（3*365天）
 * formatDuration(94694461000) // "3年1天1小时1分钟1秒"
 * ```
 */
export function formatDuration(timestamp: number, format?: string): string | number {
  // 确保timestamp是正数
  const duration = Math.abs(timestamp)

  // 定义时间单位常量（毫秒）
  const SECOND = 1000
  const MINUTE = 60 * SECOND
  const HOUR = 60 * MINUTE
  const DAY = 24 * HOUR
  const MONTH = 30 * DAY // 30天 = 1个月
  const YEAR = 365 * DAY // 365天 = 1年

  // 也可以在当前时间上加上 timestamp，使用 dayjs 计算距离现在多少时间，不需要手动计算
  // 计算各个时间单位
  const years = Math.floor(duration / YEAR)
  const months = Math.floor((duration % YEAR) / MONTH)
  const days = Math.floor((duration % MONTH) / DAY)
  const hours = Math.floor((duration % DAY) / HOUR)
  const minutes = Math.floor((duration % HOUR) / MINUTE)
  const seconds = Math.floor((duration % MINUTE) / SECOND)

  // 如果提供了格式化字符串，按照格式返回
  if (format) {
    const trimmedFormat = format.trim()

    // 计算各单位的总数（精确值，保留小数）
    const totalYears = duration / YEAR
    const totalMonths = duration / MONTH
    const totalDays = duration / DAY
    const totalHours = duration / HOUR
    const totalMinutes = duration / MINUTE
    const totalSeconds = duration / SECOND

    // 单位映射表
    const unitMap: Record<string, { total: number, current: number }> = {
      YY: { total: totalYears, current: years },
      Y: { total: totalYears, current: years },
      MM: { total: totalMonths, current: months },
      M: { total: totalMonths, current: months },
      DD: { total: totalDays, current: days },
      D: { total: totalDays, current: days },
      HH: { total: totalHours, current: hours },
      H: { total: totalHours, current: hours },
      mm: { total: totalMinutes, current: minutes },
      m: { total: totalMinutes, current: minutes },
      ss: { total: totalSeconds, current: seconds },
      s: { total: totalSeconds, current: seconds },
    }

    // 如果是单一单位格式，返回该单位的总数（数字，保留合理精度）
    if (unitMap[trimmedFormat]) {
      const totalValue = unitMap[trimmedFormat].total
      // 保留最多3位小数，但去除末尾的零
      return Math.round(totalValue * 1000) / 1000
    }

    // 复合格式：替换所有匹配的格式标记
    let result = format

    // 按照长度降序处理，避免短格式覆盖长格式（如 H 覆盖 HH）
    const formatTokens = ['YY', 'MM', 'DD', 'HH', 'mm', 'ss', 'Y', 'M', 'D', 'H', 'm', 's']

    for (const token of formatTokens) {
      if (result.includes(token) && unitMap[token]) {
        const { current } = unitMap[token]
        const paddedValue = current.toString().padStart(token.length, '0')
        result = result.replace(new RegExp(token, 'g'), paddedValue)
      }
    }

    return result
  }

  // 智能格式：只显示有意义的单位
  const parts: string[] = []

  if (years > 0) {
    parts.push(`${years}年`)
  }

  if (months > 0) {
    parts.push(`${months}个月`)
  }

  if (days > 0) {
    parts.push(`${days}天`)
  }

  if (hours > 0) {
    parts.push(`${hours}小时`)
  }

  if (minutes > 0) {
    parts.push(`${minutes}分钟`)
  }

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}秒`)
  }

  return parts.join('')
}

// ==================== 日期范围工具 ====================

/**
 * 日期范围元组类型，包含开始和结束时间戳（毫秒）
 */
export type DateRange = [number, number]

/**
 * 日期快捷键函数类型
 */
export type DateShortcutFn = () => DateRange

/**
 * 预设快捷键名称
 */
export type PresetShortcutKey =
  | '今天'
  | '本周'
  | '本月'
  | '本季度'
  | '本半年'
  | '本年'
  | '最近7天'
  | '最近30天'
  | '最近3个月'
  | '最近半年'
  | '最近一年'

/**
 * 日期快捷键配置对象类型
 * 支持预设快捷键名称和自定义字符串键
 */
export type DateShortcutsConfig = Record<string, DateShortcutFn>

/**
 * 日期快捷键配置项类型，可以是预设名称字符串或自定义配置对象
 * 支持预设快捷键名称（带自动补全）和任意自定义字符串
 */
export type DateShortcutItem = PresetShortcutKey | (string & {}) | Record<string, PresetShortcutKey | (string & {}) | DateShortcutFn>

/**
 * 获取指定偏移天数的日期
 * @param offset 偏移天数（负数表示过去，正数表示未来），默认为 0
 * @returns 日期对象
 * @group DateRange
 * @example
 * ```ts
 * getDateByOffset() // 今天
 * getDateByOffset(-1) // 昨天
 * getDateByOffset(1) // 明天
 * getDateByOffset(-7) // 7天前
 * ```
 */
export function getDateByOffset(offset = 0): Date {
  return add(new Date(), offset, 'day')
}

/**
 * 获取昨天的日期字符串 (YYYY-MM-DD)
 * @returns 昨天的日期字符串
 * @group DateRange
 * @example
 * ```ts
 * getYesterdayStr() // "2023-05-14"（假设今天是 2023-05-15）
 * ```
 */
export function getYesterdayStr(): string {
  return formatDate(getDateByOffset(-1))
}

/**
 * 获取今天的日期字符串 (YYYY-MM-DD)
 * @returns 今天的日期字符串
 * @group DateRange
 * @example
 * ```ts
 * getTodayStr() // "2023-05-15"
 * ```
 */
export function getTodayStr(): string {
  return formatDate(new Date())
}

/**
 * 获取今天的开始和结束时间戳
 * @returns 日期范围元组 [开始时间戳, 结束时间戳]
 * @group DateRange
 * @example
 * ```ts
 * const [start, end] = getTodayRange()
 * // start: 今天 00:00:00 的时间戳
 * // end: 今天 23:59:59.999 的时间戳
 * ```
 */
export function getTodayRange(): DateRange {
  const now = new Date()
  return [startOf(now, 'day').getTime(), endOf(now, 'day').getTime()]
}

/**
 * 获取本周的开始和结束时间戳（周一到周日）
 * @returns 日期范围元组 [开始时间戳, 结束时间戳]
 * @group DateRange
 * @example
 * ```ts
 * const [start, end] = getThisWeekRange()
 * // start: 本周一 00:00:00 的时间戳
 * // end: 本周日 23:59:59.999 的时间戳
 * ```
 */
export function getThisWeekRange(): DateRange {
  const now = new Date()
  const day = now.getDay() || 7 // 将周日从 0 改为 7
  const mondayOffset = -(day - 1)
  const sundayOffset = 7 - day

  const start = startOf(add(now, mondayOffset, 'day'), 'day')
  const end = endOf(add(now, sundayOffset, 'day'), 'day')
  return [start.getTime(), end.getTime()]
}

/**
 * 获取本月的开始和结束时间戳
 * @returns 日期范围元组 [开始时间戳, 结束时间戳]
 * @group DateRange
 * @example
 * ```ts
 * const [start, end] = getThisMonthRange()
 * // start: 本月1日 00:00:00 的时间戳
 * // end: 本月最后一天 23:59:59.999 的时间戳
 * ```
 */
export function getThisMonthRange(): DateRange {
  const now = new Date()
  return [startOf(now, 'month').getTime(), endOf(now, 'month').getTime()]
}

/**
 * 获取本季度的开始和结束时间戳
 * @returns 日期范围元组 [开始时间戳, 结束时间戳]
 * @group DateRange
 * @example
 * ```ts
 * const [start, end] = getThisQuarterRange()
 * // 如果当前是5月（Q2），则：
 * // start: 4月1日 00:00:00 的时间戳
 * // end: 6月30日 23:59:59.999 的时间戳
 * ```
 */
export function getThisQuarterRange(): DateRange {
  const now = new Date()
  const quarter = Math.floor(now.getMonth() / 3)
  const start = new Date(now.getFullYear(), quarter * 3, 1, 0, 0, 0, 0)
  const end = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999)
  return [start.getTime(), end.getTime()]
}

/**
 * 获取本半年的开始和结束时间戳
 * @returns 日期范围元组 [开始时间戳, 结束时间戳]
 * @group DateRange
 * @example
 * ```ts
 * const [start, end] = getThisHalfYearRange()
 * // 如果当前是5月（上半年），则：
 * // start: 1月1日 00:00:00 的时间戳
 * // end: 6月30日 23:59:59.999 的时间戳
 * ```
 */
export function getThisHalfYearRange(): DateRange {
  const now = new Date()
  const half = now.getMonth() < 6 ? 0 : 1
  const start = new Date(now.getFullYear(), half * 6, 1, 0, 0, 0, 0)
  const end = new Date(now.getFullYear(), half * 6 + 6, 0, 23, 59, 59, 999)
  return [start.getTime(), end.getTime()]
}

/**
 * 获取本年的开始和结束时间戳
 * @returns 日期范围元组 [开始时间戳, 结束时间戳]
 * @group DateRange
 * @example
 * ```ts
 * const [start, end] = getThisYearRange()
 * // start: 1月1日 00:00:00 的时间戳
 * // end: 12月31日 23:59:59.999 的时间戳
 * ```
 */
export function getThisYearRange(): DateRange {
  const now = new Date()
  return [startOf(now, 'year').getTime(), endOf(now, 'year').getTime()]
}

/**
 * 获取最近 N 天的时间范围
 * @param days 天数
 * @returns 日期范围元组 [开始时间戳, 结束时间戳]
 * @group DateRange
 * @example
 * ```ts
 * const [start, end] = getLastDaysRange(7)
 * // start: 7天前 00:00:00 的时间戳
 * // end: 当前时间戳
 *
 * const [start, end] = getLastDaysRange(30)
 * // start: 30天前 00:00:00 的时间戳
 * // end: 当前时间戳
 * ```
 */
export function getLastDaysRange(days: number): DateRange {
  const now = new Date()
  const start = startOf(add(now, -(days - 1), 'day'), 'day')
  return [start.getTime(), now.getTime()]
}

/**
 * 获取最近 N 周的时间范围
 * @param weeks 周数
 * @returns 日期范围元组 [开始时间戳, 结束时间戳]
 * @group DateRange
 * @example
 * ```ts
 * const [start, end] = getLastWeeksRange(2)
 * // start: 2周前的时间戳
 * // end: 当前时间戳
 * ```
 */
export function getLastWeeksRange(weeks: number): DateRange {
  const now = new Date()
  const start = add(now, -weeks * 7, 'day')
  return [start.getTime(), now.getTime()]
}

/**
 * 获取最近 N 个月的时间范围
 * @param months 月数
 * @returns 日期范围元组 [开始时间戳, 结束时间戳]
 * @group DateRange
 * @example
 * ```ts
 * const [start, end] = getLastMonthsRange(3)
 * // start: 3个月前当天 00:00:00 的时间戳
 * // end: 当前时间戳
 *
 * const [start, end] = getLastMonthsRange(12)
 * // start: 12个月前当天 00:00:00 的时间戳
 * // end: 当前时间戳
 * ```
 */
export function getLastMonthsRange(months: number): DateRange {
  const now = new Date()
  const start = startOf(add(now, -months, 'month'), 'day')
  return [start.getTime(), now.getTime()]
}

/**
 * 常用日期范围快捷键配置
 *
 * 可直接用于 DateRangePicker 组件的 shortcuts 属性
 *
 * @group DateRange
 * @example
 * ```ts
 * // 在 Element Plus 中使用
 * <el-date-picker
 *   type="daterange"
 *   :shortcuts="Object.entries(commonDateShortcuts).map(([text, value]) => ({ text, value }))"
 * />
 *
 * // 获取今天的范围
 * const [start, end] = commonDateShortcuts['今天']()
 *
 * // 获取本月的范围
 * const [start, end] = commonDateShortcuts['本月']()
 * ```
 */
export const commonDateShortcuts: DateShortcutsConfig = {
  今天: getTodayRange,
  本周: getThisWeekRange,
  本月: getThisMonthRange,
  本季度: getThisQuarterRange,
  本半年: getThisHalfYearRange,
  本年: getThisYearRange,
  最近7天: () => getLastDaysRange(7),
  最近30天: () => getLastDaysRange(30),
  最近3个月: () => getLastMonthsRange(3),
  最近半年: () => getLastMonthsRange(6),
  最近一年: () => getLastMonthsRange(12),
}

/**
 * 创建日期范围快捷键配置
 *
 * 支持多种输入格式，简化快捷键配置。可以从预设的 commonDateShortcuts 中选择，
 * 也可以自定义快捷键名称和函数。
 *
 * @param config 快捷键配置，支持以下格式：
 *   - 字符串数组：从 commonDateShortcuts 中选择预设快捷键
 *   - 对象数组：自定义键名映射到预设或自定义函数
 *   - 对象：直接传入快捷键配置对象
 * @returns 快捷键配置对象
 * @group DateRange
 * @example
 * ```ts
 * // 方式1: 传入字符串数组（从 commonDateShortcuts 中选择）
 * const shortcuts = createDateShortcuts(['今天', '本周', '本月'])
 * // => { 今天: getTodayRange, 本周: getThisWeekRange, 本月: getThisMonthRange }
 *
 * // 方式2: 传入对象数组（支持自定义键名）
 * const shortcuts = createDateShortcuts([
 *   { 今天: '今天' },
 *   { 这周: '本周' }, // 显示"这周"，实际使用"本周"的逻辑
 *   { 自定义: () => [Date.now() - 86400000, Date.now()] }
 * ])
 *
 * // 方式3: 直接传入对象（兼容旧方式）
 * const shortcuts = createDateShortcuts({
 *   今天: commonDateShortcuts['今天'],
 *   自定义: () => [Date.now(), Date.now()]
 * })
 *
 * // 在 Vue 组件中使用
 * const shortcuts = createDateShortcuts(['今天', '本周', '本月', '最近7天'])
 * // 转换为 Element Plus 格式
 * const elShortcuts = Object.entries(shortcuts).map(([text, value]) => ({ text, value }))
 * ```
 */
export function createDateShortcuts(
  config: DateShortcutItem[] | DateShortcutsConfig,
): DateShortcutsConfig {
  // 如果是对象，直接返回
  if (!Array.isArray(config)) {
    return config
  }

  const result: DateShortcutsConfig = {}

  config.forEach((item) => {
    if (typeof item === 'string') {
      // 字符串数组: ['今天', '本周']
      if (commonDateShortcuts[item]) {
        result[item] = commonDateShortcuts[item]
      }
      else {
        console.warn(`[createDateShortcuts] 未找到快捷键: "${item}"`)
      }
    }
    else if (typeof item === 'object' && item !== null) {
      // 对象数组: [{ 今天: '今天' }, { 这周: '本周' }]
      Object.entries(item).forEach(([key, value]) => {
        if (typeof value === 'string') {
          // value 是字符串，从 commonDateShortcuts 中查找
          if (commonDateShortcuts[value]) {
            result[key] = commonDateShortcuts[value]
          }
          else {
            console.warn(`[createDateShortcuts] 未找到快捷键: "${value}"`)
          }
        }
        else if (typeof value === 'function') {
          // value 是函数，直接使用
          result[key] = value
        }
      })
    }
  })

  return result
}
