import { describe, expect, it } from 'vitest'
import {
  addDays,
  addMonths,
  addYears,
  formatDate,
  getDayOfWeek,
  isDateInRange,
  parseDate,
} from './index'

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
