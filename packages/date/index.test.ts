import { describe, expect, it, vi } from 'vitest'
import {
  add,
  addDays,
  addMonths,
  addYears,
  convertToDayjsParam,
  createDate,
  diff,
  endOf,
  formatDate,
  formatFullTime,
  formatHumanReadable,
  fromNow,
  getDayOfWeek,
  getDaysInMonth,
  isDateInRange,
  isMillisecondTimestamp,
  now,
  parseDate,
  startOf,
} from './index'

describe('createDate', () => {
  it('应该创建当前日期的dayjs对象', () => {
    const date = createDate()
    expect(date.isValid()).toBe(true)
  })

  it('应该从不同类型的输入创建dayjs对象', () => {
    const dateObj = new Date(2023, 0, 15)
    const dateStr = '2023-01-15'
    const timestamp = 1673740800000 // 2023-01-15 in milliseconds

    expect(createDate(dateObj).format('YYYY-MM-DD')).toBe('2023-01-15')
    expect(createDate(dateStr).format('YYYY-MM-DD')).toBe('2023-01-15')
    expect(createDate(timestamp).format('YYYY-MM-DD')).toBe('2023-01-15')
  })
})

describe('isMillisecondTimestamp', () => {
  it('应该识别毫秒级时间戳', () => {
    const msTimestamp = 1673740800000 // 13位数字
    expect(isMillisecondTimestamp(msTimestamp)).toBe(true)
  })

  it('应该拒绝非毫秒级时间戳', () => {
    expect(isMillisecondTimestamp(1673740800)).toBe(false) // 10位数字
    expect(isMillisecondTimestamp('1673740800000')).toBe(false) // 字符串
    expect(isMillisecondTimestamp(new Date())).toBe(false) // 日期对象
    expect(isMillisecondTimestamp({})).toBe(false) // 非数字
  })
})

describe('convertToDayjsParam', () => {
  it('应该转换秒级时间戳为毫秒', () => {
    const secTimestamp = 1673740800 // 秒级时间戳
    const msTimestamp = 1673740800000 // 毫秒级时间戳
    expect(convertToDayjsParam(secTimestamp)).toBe(msTimestamp)
  })

  it('应该保持毫秒级时间戳不变', () => {
    const msTimestamp = 1673740800000
    expect(convertToDayjsParam(msTimestamp)).toBe(msTimestamp)
  })

  it('应该保持非时间戳值不变', () => {
    const dateObj = new Date(2023, 0, 15)
    const dateStr = '2023-01-15'
    expect(convertToDayjsParam(dateObj)).toBe(dateObj)
    expect(convertToDayjsParam(dateStr)).toBe(dateStr)
  })
})

describe('formatDate', () => {
  it('应该以指定格式格式化日期', () => {
    const date = new Date(2023, 0, 15) // 2023-01-15
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-01-15')
    expect(formatDate(date, 'YYYY/MM/DD')).toBe('2023/01/15')
    expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/15/2023')
  })

  it('应该使用默认格式', () => {
    const date = new Date(2023, 0, 15)
    expect(formatDate(date)).toBe('2023-01-15')
  })

  it('应该正确处理秒级时间戳', () => {
    const secTimestamp = 1673740800 // 2023-01-15 in seconds
    expect(formatDate(secTimestamp, 'YYYY-MM-DD')).toBe('2023-01-15')
  })
})

describe('formatFullTime', () => {
  it('应该格式化为完整的时间字符串', () => {
    const date = new Date(2023, 0, 15, 12, 30, 45)
    expect(formatFullTime(date)).toBe('2023-01-15 12:30:45')
  })
})

describe('now', () => {
  it('应该返回当前时间戳', () => {
    const mockDate = new Date(2023, 0, 15).getTime()
    vi.spyOn(Date, 'now').mockImplementation(() => mockDate)

    expect(now()).toBe(mockDate)

    vi.restoreAllMocks()
  })
})

describe('parseDate', () => {
  it('应该解析有效的日期字符串', () => {
    const dateStr = '2023-01-15'
    const date = parseDate(dateStr)
    expect(date.getFullYear()).toBe(2023)
    expect(date.getMonth()).toBe(0) // 0-based (January)
    expect(date.getDate()).toBe(15)
  })

  it('应该抛出错误当遇到无效的日期格式', () => {
    expect(() => parseDate('invalid-date')).toThrow('无效的日期格式')
  })
})

describe('diff', () => {
  it('应该计算两个日期之间的差异（默认为天）', () => {
    const date1 = new Date(2023, 0, 15)
    const date2 = new Date(2023, 0, 10)
    expect(diff(date1, date2)).toBe(5)
  })

  it('应该计算不同单位的差异', () => {
    const date1 = new Date(2023, 0, 15, 12, 0, 0)
    const date2 = new Date(2023, 0, 15, 6, 0, 0)
    expect(diff(date1, date2, 'hour')).toBe(6)

    const date3 = new Date(2023, 0, 15)
    const date4 = new Date(2022, 0, 15)
    expect(diff(date3, date4, 'year')).toBe(1)
  })

  it('应该处理秒级时间戳输入', () => {
    const sec1 = 1673740800 // 2023-01-15 00:00:00
    const sec2 = 1673308800 // 2023-01-10 00:00:00
    expect(diff(sec1, sec2)).toBe(5)
  })
})

describe('add', () => {
  it('应该添加指定的时间量', () => {
    const date = new Date(2023, 0, 15)
    const result = add(date, 5, 'day')
    expect(result.getDate()).toBe(20)
  })
})

describe('addDays', () => {
  it('应该正确添加天数', () => {
    const date = new Date(2023, 0, 15)
    const newDate = addDays(date, 5)
    expect(newDate.getDate()).toBe(20)

    const negativeDate = addDays(date, -5)
    expect(negativeDate.getDate()).toBe(10)
  })
})

describe('addMonths', () => {
  it('应该正确添加月数', () => {
    const date = new Date(2023, 0, 15) // Jan 15, 2023
    const newDate = addMonths(date, 2) // Mar 15, 2023
    expect(newDate.getMonth()).toBe(2)

    const negativeDate = addMonths(date, -1) // Dec 15, 2022
    expect(negativeDate.getMonth()).toBe(11)
    expect(negativeDate.getFullYear()).toBe(2022)
  })
})

describe('addYears', () => {
  it('应该正确添加年数', () => {
    const date = new Date(2023, 0, 15)
    const newDate = addYears(date, 2)
    expect(newDate.getFullYear()).toBe(2025)

    const negativeDate = addYears(date, -2)
    expect(negativeDate.getFullYear()).toBe(2021)
  })
})

describe('getDayOfWeek', () => {
  it('应该返回正确的星期几（周日开始）', () => {
    // 2023-01-15 是周日
    const sunday = new Date(2023, 0, 15)
    expect(getDayOfWeek(sunday)).toBe(0)

    // 2023-01-16 是周一
    const monday = new Date(2023, 0, 16)
    expect(getDayOfWeek(monday)).toBe(1)
  })

  it('应该返回正确的星期几（周一开始）', () => {
    // 2023-01-15 是周日，按周一开始应该是 6
    const sunday = new Date(2023, 0, 15)
    expect(getDayOfWeek(sunday, true)).toBe(6)

    // 2023-01-16 是周一，按周一开始应该是 0
    const monday = new Date(2023, 0, 16)
    expect(getDayOfWeek(monday, true)).toBe(0)
  })
})

describe('isDateInRange', () => {
  it('应该检测日期是否在范围内', () => {
    const start = new Date(2023, 0, 10)
    const end = new Date(2023, 0, 20)
    const date = new Date(2023, 0, 15)
    const outside1 = new Date(2023, 0, 5)
    const outside2 = new Date(2023, 0, 25)

    expect(isDateInRange(date, start, end)).toBe(true)
    expect(isDateInRange(outside1, start, end)).toBe(false)
    expect(isDateInRange(outside2, start, end)).toBe(false)
  })
})

describe('getDaysInMonth', () => {
  it('应该返回月份的天数', () => {
    expect(getDaysInMonth(2023, 0)).toBe(31) // 一月 31 天
    expect(getDaysInMonth(2023, 1)).toBe(28) // 二月 28 天（非闰年）
    expect(getDaysInMonth(2020, 1)).toBe(29) // 二月 29 天（闰年）
    expect(getDaysInMonth(2023, 3)).toBe(30) // 四月 30 天
  })
})

describe('startOf', () => {
  it('应该返回时间单位的开始时间', () => {
    const date = new Date(2023, 0, 15, 12, 30, 45, 500)

    const startOfDay = startOf(date, 'day')
    expect(startOfDay.getHours()).toBe(0)
    expect(startOfDay.getMinutes()).toBe(0)
    expect(startOfDay.getSeconds()).toBe(0)
    expect(startOfDay.getMilliseconds()).toBe(0)

    const startOfMonth = startOf(date, 'month')
    expect(startOfMonth.getDate()).toBe(1)
    expect(startOfMonth.getHours()).toBe(0)

    const startOfYear = startOf(date, 'year')
    expect(startOfYear.getMonth()).toBe(0)
    expect(startOfYear.getDate()).toBe(1)
  })
})

describe('endOf', () => {
  it('应该返回时间单位的结束时间', () => {
    const date = new Date(2023, 0, 15, 12, 30, 45, 500)

    const endOfDay = endOf(date, 'day')
    expect(endOfDay.getHours()).toBe(23)
    expect(endOfDay.getMinutes()).toBe(59)
    expect(endOfDay.getSeconds()).toBe(59)

    const endOfMonth = endOf(date, 'month')
    expect(endOfMonth.getDate()).toBe(31) // 一月有31天
    expect(endOfMonth.getHours()).toBe(23)

    const endOfYear = endOf(date, 'year')
    expect(endOfYear.getMonth()).toBe(11) // 11 = 十二月
    expect(endOfYear.getDate()).toBe(31)
  })
})

describe('fromNow', () => {
  it('应该返回相对于当前时间的描述', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2023, 0, 15, 12, 0, 0))

    const fiveMinutesAgo = new Date(2023, 0, 15, 11, 55, 0)
    const oneDayLater = new Date(2023, 0, 16, 12, 0, 0)

    // 确保匹配中文输出
    expect(fromNow(fiveMinutesAgo)).toBe('5 分钟前')
    expect(fromNow(oneDayLater)).toBe('1 天内')

    vi.useRealTimers()
  })

  it('应该支持自定义基准日期', () => {
    const baseDate = new Date(2023, 0, 15)
    const fourDaysEarlier = new Date(2023, 0, 11)

    // 确保匹配中文输出
    expect(fromNow(fourDaysEarlier, baseDate)).toBe('4 天前')
  })
})

describe('formatHumanReadable', () => {
  it('应该格式化为人类友好的格式', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2023, 0, 15, 12, 0, 0))

    const today = new Date(2023, 0, 15, 15, 30, 0)
    const yesterday = new Date(2023, 0, 14, 15, 30, 0)
    const tomorrow = new Date(2023, 0, 16, 15, 30, 0)
    const thisYear = new Date(2023, 5, 15, 15, 30, 0)
    const otherYear = new Date(2022, 5, 15, 15, 30, 0)

    // 这些测试预期应该不受语言环境影响，因为它们是直接硬编码的中文文本
    expect(formatHumanReadable(today)).toBe('今天 15:30')
    expect(formatHumanReadable(yesterday)).toBe('昨天 15:30')
    expect(formatHumanReadable(tomorrow)).toBe('明天 15:30')
    expect(formatHumanReadable(thisYear)).toBe('6月15日 15:30')
    expect(formatHumanReadable(otherYear)).toBe('2022年6月15日 15:30')

    vi.useRealTimers()
  })
})
