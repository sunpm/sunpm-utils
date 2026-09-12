import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  clamp,
  formatCurrency,
  formatNumberWithTenThousand,
  formatThousands,
  isEven,
  isOdd,
  isZero,
  percentage,
  randomInt,
  round,
  toNumber,
  trimDecimalZeros,
} from './index'

describe('trimDecimalZeros', () => {
  it.each([
    ['12.00', '12'],
    ['12.50', '12.5'],
    ['12.00500', '12.005'],
    ['1000', '1000'],
    ['1000.000', '1000'],
    ['12.', '12'],
    ['.500', '.5'],
    ['.000', '0'],
    ['+.00', '+0'],
    ['-.00', '-0'],
    ['-0.00', '-0'],
    [' +0012.500 ', '+0012.5'],
    [12.5, '12.5'],
    [0, '0'],
    [-0, '0'],
    [1e-7, '1e-7'],
    [1e21, '1e+21'],
  ])('应该将 %j 清理为 %s', (value, expected) => {
    expect(trimDecimalZeros(value)).toBe(expected)
  })

  it('应该保留超出 number 精度或范围的字符串', () => {
    expect(trimDecimalZeros('9007199254740993.0100')).toBe('9007199254740993.01')
    const tiny = `0.${'0'.repeat(400)}100`
    expect(trimDecimalZeros(tiny)).toBe(`0.${'0'.repeat(400)}1`)
    const huge = '9'.repeat(400)
    expect(trimDecimalZeros(`${huge}.00`)).toBe(huge)
  })

  it.each([
    ['1.200e+3', '1.2e+3'],
    ['12.00E-10', '12E-10'],
    ['1e+100', '1e+100'],
    ['.00e3', '0e3'],
    ['1.0100e-400', '1.01e-400'],
  ])('应该清理科学计数法 %s 并保留指数', (value, expected) => {
    expect(trimDecimalZeros(value)).toBe(expected)
  })
})

describe('isZero', () => {
  it.each([0, -0, '0', '0.00', '-0.000', '+00.00', ' 0 ', '.0', '-.00', '0.', '0e3', '-0.00E-400'])('应该识别零值 %j', (value) => {
    expect(isZero(value)).toBe(true)
  })

  it.each([1, -1, 0.01, Number.MIN_VALUE, '0.01', '-0.1', '10', '1e-400', '-1e-400', '1e400'])('不应将非零值 %j 判断为零', (value) => {
    expect(isZero(value)).toBe(false)
  })

  it('不应将小数位极长的非零字符串判断为零', () => {
    expect(isZero(`0.${'0'.repeat(400)}1`)).toBe(false)
  })
})

describe('toNumber', () => {
  it.each([
    ['12.00', 12],
    ['12.50', 12.5],
    [' +0012.50 ', 12.5],
    ['-.50', -0.5],
    ['12.', 12],
    ['0.00', 0],
    ['-0.00', -0],
    ['1.25e2', 125],
    ['1E-7', 1e-7],
    [0, 0],
    [-0, -0],
    [12.5, 12.5],
    [Number.MAX_VALUE, Number.MAX_VALUE],
    [Number.MIN_VALUE, Number.MIN_VALUE],
  ])('应该将 %j 转换为 number', (value, expected) => {
    expect(toNumber(value)).toBe(expected)
  })

  it('应该在溢出时返回兜底值', () => {
    expect(toNumber('1e400')).toBeUndefined()
    expect(toNumber('-1e400', null)).toBeNull()
    expect(toNumber('9'.repeat(400), 0)).toBe(0)
  })

  it('应该支持自定义兜底值，并保留有效的零值', () => {
    expect(toNumber('', 0)).toBe(0)
    expect(toNumber(null, 10)).toBe(10)
    expect(toNumber(undefined, null)).toBeNull()
    expect(toNumber('abc', undefined)).toBeUndefined()
    expect(toNumber('0.00', 10)).toBe(0)
  })

  it('应该根据兜底值推导适合组件绑定的类型', () => {
    expectTypeOf(toNumber('12.50')).toEqualTypeOf<number | undefined>()
    expectTypeOf(toNumber('12.50', 0)).toEqualTypeOf<number>()
    expectTypeOf(toNumber('', null)).toEqualTypeOf<number | null>()
    expectTypeOf(toNumber('', undefined)).toEqualTypeOf<number | undefined>()
    expectTypeOf(trimDecimalZeros('12.00')).toEqualTypeOf<string>()
    expectTypeOf(isZero('0.00')).toEqualTypeOf<boolean>()
  })
})

describe('数字输入边界', () => {
  it.each([
    '',
    '   ',
    '\t\n',
    null,
    undefined,
    true,
    false,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    'NaN',
    'Infinity',
    'abc',
    '12px',
    'abc.00',
    '1,000.00',
    '0x00',
    '0b0',
    '0o0',
    '1_000',
    '.',
    '+',
    '-',
    '1.2.3',
    '0e',
    '0 0',
    [],
    [0],
    {},
    { valueOf: () => 0 },
    0n,
    Symbol('0'),
  ].map(value => ({ value })))('应该拒绝空值或无效输入 %#', ({ value }) => {
    expect(trimDecimalZeros(value)).toBe('')
    expect(isZero(value)).toBe(false)
    expect(toNumber(value)).toBeUndefined()
    expect(toNumber(value, null)).toBeNull()
    expect(toNumber(value, 10)).toBe(10)
  })
})

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

  it('应该支持数字字符串', () => {
    const result = formatCurrency('1234.56', { currency: 'CNY', locale: 'zh-CN' })
    expect(result).toMatch(/¥|￥|CNY/) // 匹配币种符号
    expect(result).toMatch(/1[,，.]234[,，.]56/) // 匹配数值部分
  })

  it('showSymbol 为 false 时不应显示货币符号', () => {
    const result = formatCurrency(1234.56, { currency: 'CNY', locale: 'zh-CN', showSymbol: false })
    expect(result).not.toMatch(/¥|￥|CNY/) // 不应包含货币符号
    expect(result).toMatch(/1[,，.]234[,，.]56/) // 数值部分格式化不变
  })

  it('非法输入应返回空字符串', () => {
    expect(formatCurrency('abc')).toBe('')
    expect(formatCurrency(Number.NaN)).toBe('')
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
