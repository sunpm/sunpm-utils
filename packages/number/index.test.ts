import { describe, expect, it } from 'vitest'
import {
  clamp,
  formatCurrency,
  formatNumberWithTenThousand,
  formatThousands,
  isEven,
  isOdd,
  percentage,
  randomInt,
  round,
} from './index'

describe('round', () => {
  it('应该正确四舍五入', () => {
    expect(round(1.234)).toBe(1)
    expect(round(1.5)).toBe(2)
    expect(round(1.234, 2)).toBe(1.23)
    expect(round(1.235, 2)).toBe(1.24)
  })

  it('应该处理负数', () => {
    expect(round(-1.234, 2)).toBe(-1.23)
    expect(round(-1.235, 2)).toBe(-1.24)
  })

  it('应该处理零', () => {
    expect(round(0, 2)).toBe(0)
  })
})

describe('formatThousands', () => {
  it('应该正确添加千位分隔符', () => {
    // 由于测试环境的区域设置可能不同，我们测试固定格式
    expect(formatThousands(1000)).toMatch(/1[,.]000/)
    expect(formatThousands(1000000)).toMatch(/1[,.]000[,.]000/)
  })

  it('应该处理小数', () => {
    const formatted = formatThousands(1234.56)
    expect(formatted).toMatch(/1[,.]234[,.]56/)
  })
})

describe('formatCurrency', () => {
  it('应该正确格式化人民币', () => {
    const result = formatCurrency(1234.56, { currency: 'CNY', locale: 'zh-CN' })
    expect(result).toMatch(/¥|￥|CNY/) // 匹配币种符号
    expect(result).toMatch(/1[,，.]234[,，.]56/) // 匹配数值部分
  })

  it('应该正确格式化美元', () => {
    const result = formatCurrency(1234.56, { currency: 'USD', locale: 'en-US' })
    expect(result).toMatch(/\$|USD/) // 匹配币种符号
    expect(result).toMatch(/1[,，.]234[,，.]56/) // 匹配数值部分
  })

  it('应该使用默认选项', () => {
    const result = formatCurrency(1234.56)
    expect(result).not.toBe('')
  })
})

describe('clamp', () => {
  it('应该将数值限制在指定范围内', () => {
    expect(clamp(5, 0, 10)).toBe(5) // 在范围内，不变
    expect(clamp(-5, 0, 10)).toBe(0) // 小于最小值，返回最小值
    expect(clamp(15, 0, 10)).toBe(10) // 大于最大值，返回最大值
  })

  it('应该处理边界情况', () => {
    expect(clamp(0, 0, 10)).toBe(0) // 等于最小值
    expect(clamp(10, 0, 10)).toBe(10) // 等于最大值
  })
})

describe('randomInt', () => {
  it('应该生成指定范围内的随机数', () => {
    const min = 1
    const max = 10
    for (let i = 0; i < 100; i++) { // 多次测试确保可靠性
      const result = randomInt(min, max)
      expect(result).toBeGreaterThanOrEqual(min)
      expect(result).toBeLessThanOrEqual(max)
      expect(Number.isInteger(result)).toBe(true)
    }
  })

  it('应该处理相同的最小值和最大值', () => {
    expect(randomInt(5, 5)).toBe(5)
  })
})

describe('isEven', () => {
  it('应该正确识别偶数', () => {
    expect(isEven(2)).toBe(true)
    expect(isEven(4)).toBe(true)
    expect(isEven(0)).toBe(true)
    expect(isEven(-2)).toBe(true)
  })

  it('应该正确识别非偶数', () => {
    expect(isEven(1)).toBe(false)
    expect(isEven(3)).toBe(false)
    expect(isEven(-1)).toBe(false)
  })
})

describe('isOdd', () => {
  it('应该正确识别奇数', () => {
    expect(isOdd(1)).toBe(true)
    expect(isOdd(3)).toBe(true)
    expect(isOdd(-1)).toBe(true)
  })

  it('应该正确识别非奇数', () => {
    expect(isOdd(2)).toBe(false)
    expect(isOdd(4)).toBe(false)
    expect(isOdd(0)).toBe(false)
    expect(isOdd(-2)).toBe(false)
  })
})

describe('percentage', () => {
  it('应该正确计算百分比', () => {
    expect(percentage(25, 100)).toBe(25)
    expect(percentage(1, 3, 2)).toBe(33.33)
    expect(percentage(1, 3, 0)).toBe(33)
  })

  it('应该处理零和负数', () => {
    expect(percentage(0, 100)).toBe(0)
    expect(percentage(100, 0)).toBe(0) // 除以零应该返回0
    expect(percentage(-50, 100)).toBe(-50)
  })
})

describe('formatNumberWithTenThousand', () => {
  it('应该将大于等于10000的数字转换为万为单位', () => {
    expect(formatNumberWithTenThousand(10000)).toBe('1.00万')
    expect(formatNumberWithTenThousand(12345)).toBe('1.23万')
    expect(formatNumberWithTenThousand(12345, 1)).toBe('1.2万')
    expect(formatNumberWithTenThousand(12345, 0)).toBe('1万')
  })

  it('应该保持小于10000的数字不变', () => {
    expect(formatNumberWithTenThousand(9999)).toBe('9999')
    expect(formatNumberWithTenThousand(0)).toBe('0')
  })

  it('应该处理边界情况', () => {
    expect(formatNumberWithTenThousand(10000, 0)).toBe('1万')
    expect(formatNumberWithTenThousand(9999.9999)).toBe('9999.9999')
  })
})
