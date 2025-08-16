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
  formatChatTime,
  formatDate,
  formatDuration,
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
    const date = new Date('2023-05-15 14:30:00')

    // 模拟 "现在" 为 2023-05-15 15:00:00
    vi.setSystemTime(new Date('2023-05-15 15:00:00'))

    expect(formatHumanReadable(date)).toBe('今天 14:30')

    // 恢复系统时间
    vi.useRealTimers()
  })
})

describe('formatChatTime', () => {
  it('应该格式化为聊天列表时间格式', () => {
    // 模拟当前时间为 2023-05-15 15:00:00 (周一)
    const mockNow = new Date('2023-05-15 15:00:00')
    vi.setSystemTime(mockNow)

    // 当天：显示时间
    const today = new Date('2023-05-15 14:30:00')
    expect(formatChatTime(today)).toBe('14:30')

    // 昨天：显示"昨天 HH:mm"
    const yesterday = new Date('2023-05-14 09:15:00')
    expect(formatChatTime(yesterday)).toBe('昨天 09:15')

    // 7天内（不包括今天和昨天）：显示星期几
    const threeDaysAgo = new Date('2023-05-12 12:00:00') // 3天前，周五
    expect(formatChatTime(threeDaysAgo)).toBe('星期五')

    const sixDaysAgo = new Date('2023-05-09 12:00:00') // 6天前，周二
    expect(formatChatTime(sixDaysAgo)).toBe('星期二')

    // 7天前应该显示日期格式
    const sevenDaysAgo = new Date('2023-05-08 12:00:00') // 7天前
    expect(formatChatTime(sevenDaysAgo)).toBe('05月08日')

    // 今年其他日期：显示MM月DD日
    const thisYearOther = new Date('2023-03-20 10:00:00')
    expect(formatChatTime(thisYearOther)).toBe('03月20日')

    // 往年日期：显示YYYY年MM月DD日
    const lastYear = new Date('2022-12-25 16:30:00')
    expect(formatChatTime(lastYear)).toBe('2022年12月25日')

    // 恢复系统时间
    vi.useRealTimers()
  })

  it('应该正确处理7天边界情况', () => {
    // 模拟当前时间为 2023-05-20 15:00:00 (周六)
    const mockNow = new Date('2023-05-20 15:00:00')
    vi.setSystemTime(mockNow)

    // 2天前到6天前都应该显示星期几
    const twoDaysAgo = new Date('2023-05-18 12:00:00') // 2天前，周四
    expect(formatChatTime(twoDaysAgo)).toBe('星期四')

    const sixDaysAgo = new Date('2023-05-14 12:00:00') // 6天前，周日
    expect(formatChatTime(sixDaysAgo)).toBe('星期日')

    // 7天前及以上应该显示日期格式
    const sevenDaysAgo = new Date('2023-05-13 12:00:00') // 7天前，周六
    expect(formatChatTime(sevenDaysAgo)).toBe('05月13日')

    const tenDaysAgo = new Date('2023-05-10 12:00:00') // 10天前
    expect(formatChatTime(tenDaysAgo)).toBe('05月10日')

    // 恢复系统时间
    vi.useRealTimers()
  })
})

describe('formatDuration', () => {
  it('应该使用自定义格式正确格式化时长', () => {
    expect(formatDuration(3661000, 'HH:mm:ss')).toBe('01:01:01')
    expect(formatDuration(3661000, 'HH时mm分ss秒')).toBe('01时01分01秒')
    expect(formatDuration(3661000, 'HH mm ss')).toBe('01 01 01')
    expect(formatDuration(125000, 'mm:ss')).toBe('02:05')
    expect(formatDuration(5000, 'ss')).toBe(5)
  })

  it('应该使用扩展格式支持天、月、年', () => {
    // 测试天单位
    expect(formatDuration(90061000, 'DD天HH时mm分ss秒')).toBe('01天01时01分01秒')
    expect(formatDuration(86400000, 'DD天')).toBe('01天') // 正好1天

    // 测试月单位（30天 = 1个月）
    const MONTH_MS = 30 * 24 * 60 * 60 * 1000
    expect(formatDuration(MONTH_MS, 'MM月DD天')).toBe('01月00天')

    // 测试年单位（365天 = 1年）
    const YEAR_MS = 365 * 24 * 60 * 60 * 1000
    expect(formatDuration(YEAR_MS, 'YY年MM月DD天')).toBe('01年00月05天') // 365 ÷ 30 = 12个月余5天

    // 测试复合格式
    expect(formatDuration(YEAR_MS + MONTH_MS + 86400000 + 3661000, 'YY年MM月DD天HH时mm分ss秒'))
      .toBe('01年01月06天01时01分01秒') // 1年+1月+1天+1时1分1秒
  })

  it('应该智能格式化时长（只显示有意义的单位）', () => {
    expect(formatDuration(3600000)).toBe('1小时')
    expect(formatDuration(3661000)).toBe('1小时1分钟1秒')
    expect(formatDuration(125000)).toBe('2分钟5秒')
    expect(formatDuration(30000)).toBe('30秒')
    expect(formatDuration(5000)).toBe('5秒')
    expect(formatDuration(0)).toBe('0秒')
  })

  it('应该智能处理天、月、年单位', () => {
    // 测试天
    expect(formatDuration(86400000)).toBe('1天') // 正好1天
    expect(formatDuration(90061000)).toBe('1天1小时1分钟1秒')
    expect(formatDuration(172800000)).toBe('2天') // 正好2天

    // 测试月（30天 = 1个月）
    const MONTH_MS = 30 * 24 * 60 * 60 * 1000
    expect(formatDuration(MONTH_MS)).toBe('1个月') // 正好30天
    expect(formatDuration(MONTH_MS + 86400000)).toBe('1个月1天') // 31天

    // 测试年（365天 = 1年）
    const YEAR_MS = 365 * 24 * 60 * 60 * 1000
    expect(formatDuration(YEAR_MS)).toBe('1年5天') // 365天 = 12个月+5天
    expect(formatDuration(YEAR_MS + MONTH_MS)).toBe('1年1个月5天') // 1年+1个月
  })

  it('应该正确处理大于24小时但小于1天的情况', () => {
    expect(formatDuration(90000000)).toBe('1天1小时') // 25小时 = 1天1小时
    expect(formatDuration(90061000)).toBe('1天1小时1分钟1秒')
  })

  it('应该正确处理只有分钟的情况', () => {
    expect(formatDuration(60000)).toBe('1分钟')
    expect(formatDuration(120000)).toBe('2分钟')
    expect(formatDuration(3540000)).toBe('59分钟')
  })

  it('应该正确处理只有小时的情况', () => {
    expect(formatDuration(7200000)).toBe('2小时')
    expect(formatDuration(10800000)).toBe('3小时')
  })

  it('应该正确处理小时+分钟的情况', () => {
    expect(formatDuration(3660000)).toBe('1小时1分钟')
    expect(formatDuration(7320000)).toBe('2小时2分钟')
  })

  it('应该正确处理负数时间戳', () => {
    expect(formatDuration(-3661000, 'HH:mm:ss')).toBe('01:01:01')
    expect(formatDuration(-3661000)).toBe('1小时1分钟1秒')
    expect(formatDuration(-90061000)).toBe('1天1小时1分钟1秒')
  })

  it('应该正确处理复杂的自定义格式', () => {
    // 测试不同的分隔符和格式
    expect(formatDuration(3661000, 'HH-mm-ss')).toBe('01-01-01')
    expect(formatDuration(3661000, 'HH/mm/ss')).toBe('01/01/01')
    expect(formatDuration(3661000, 'HH小时mm分钟ss秒钟')).toBe('01小时01分钟01秒钟')

    // 测试扩展格式
    expect(formatDuration(90061000, 'DD-HH-mm-ss')).toBe('01-01-01-01')
    expect(formatDuration(90061000, 'DD/HH/mm/ss')).toBe('01/01/01/01')
  })

  it('应该正确处理零值的边界情况', () => {
    expect(formatDuration(0, 'HH:mm:ss')).toBe('00:00:00')
    expect(formatDuration(1000, 'HH:mm:ss')).toBe('00:00:01')
    expect(formatDuration(60000, 'HH:mm:ss')).toBe('00:01:00')
    expect(formatDuration(3600000, 'HH:mm:ss')).toBe('01:00:00')
    expect(formatDuration(86400000, 'DD:HH:mm:ss')).toBe('01:00:00:00')
  })

  it('应该正确处理超大时间值', () => {
    // 测试多年的情况（365天 * 3 = 3年）
    const threeYears = 3 * 365 * 24 * 60 * 60 * 1000
    expect(formatDuration(threeYears)).toBe('3年15天') // 3*365天 = 36个月+15天

    // 测试复合超大时间值
    const YEAR_MS = 365 * 24 * 60 * 60 * 1000
    const MONTH_MS = 30 * 24 * 60 * 60 * 1000
    const complexLargeTime = 3 * YEAR_MS + MONTH_MS + 86400000 + 3661000
    expect(formatDuration(complexLargeTime)).toBe('3年1个月16天1小时1分钟1秒') // 3年+1月+1天+1时1分1秒
  })

  it('应该在单一单位格式中显示总数而非模运算结果', () => {
    // 测试单一小时格式显示总小时数（返回数字）
    expect(formatDuration(604800000, 'HH')).toBe(168) // 7天 = 168小时
    expect(formatDuration(90000000, 'HH')).toBe(25) // 25小时

    // 测试单一分钟格式显示总分钟数（返回数字）
    expect(formatDuration(3600000, 'mm')).toBe(60) // 1小时 = 60分钟
    expect(formatDuration(7200000, 'mm')).toBe(120) // 2小时 = 120分钟

    // 测试单一秒格式显示总秒数（返回数字）
    expect(formatDuration(120000, 'ss')).toBe(120) // 2分钟 = 120秒

    // 测试单一天格式显示总天数（返回数字）
    expect(formatDuration(604800000, 'DD')).toBe(7) // 7天

    // 测试单字母格式（返回数字）
    expect(formatDuration(604800000, 'H')).toBe(168) // 7天 = 168小时
    expect(formatDuration(3600000, 'm')).toBe(60) // 1小时 = 60分钟
    expect(formatDuration(120000, 's')).toBe(120) // 2分钟 = 120秒
    expect(formatDuration(604800000, 'D')).toBe(7) // 7天
    expect(formatDuration(2592000000, 'M')).toBe(1) // 30天 = 1个月
    expect(formatDuration(31536000000, 'Y')).toBe(1) // 365天 = 1年

    // 确保复合格式仍然使用模运算（各单位在正确范围内，返回字符串）
    expect(formatDuration(604800000, 'DD天HH时')).toBe('07天00时')
    expect(formatDuration(90000000, 'DD天HH时')).toBe('01天01时')

    // 测试单字母格式在复合格式中的表现（根据字母数量决定补零位数）
    expect(formatDuration(3661000, 'H:m:s')).toBe('1:1:1') // 单字母不补零
    expect(formatDuration(3661000, 'HH:mm:ss')).toBe('01:01:01') // 双字母补零到两位
    expect(formatDuration(90000000, 'D天H时')).toBe('1天1时') // 单字母混合
    expect(formatDuration(90000000, 'DD天HH时')).toBe('01天01时') // 双字母混合
  })
})
