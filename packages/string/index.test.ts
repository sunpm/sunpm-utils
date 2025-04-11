import { describe, expect, it } from 'vitest'
import { camelToKebab, capitalize, ensureRpxUnit, isEmptyString, kebabToCamel, replaceNBSP, truncate } from './index'

describe('isEmptyString', () => {
  it('应该检测空字符串', () => {
    expect(isEmptyString('')).toBe(true)
    expect(isEmptyString('  ')).toBe(true)
    expect(isEmptyString('\n\t')).toBe(true)
  })

  it('应该检测非空字符串', () => {
    expect(isEmptyString('a')).toBe(false)
    expect(isEmptyString(' a ')).toBe(false)
  })
})

describe('truncate', () => {
  it('应该使用简单的测试用例', () => {
    const result = truncate('12345678901234567890', 10)
    expect(result).toBe('1234567...')
  })

  it('不应截断长度足够的字符串', () => {
    expect(truncate('短字符串', 10)).toBe('短字符串')
  })

  it('应该能替换自定义省略号', () => {
    const result = truncate('12345678901234567890', 10, '**')
    expect(result).toBe('12345678**')
  })
})

describe('capitalize', () => {
  it('应该将首字母大写', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('world')).toBe('World')
  })

  it('应该处理空字符串', () => {
    expect(capitalize('')).toBe('')
  })

  it('应该保留已经大写的字符', () => {
    expect(capitalize('Hello')).toBe('Hello')
  })
})

describe('camelToKebab', () => {
  it('应该将驼峰式转换为短横线式', () => {
    expect(camelToKebab('helloWorld')).toBe('hello-world')
    expect(camelToKebab('userId')).toBe('user-id')
    expect(camelToKebab('APIVersion')).toBe('api-version')
  })
})

describe('kebabToCamel', () => {
  it('应该将短横线式转换为驼峰式', () => {
    expect(kebabToCamel('hello-world')).toBe('helloWorld')
    expect(kebabToCamel('user-id')).toBe('userId')
    expect(kebabToCamel('api-version')).toBe('apiVersion')
  })
})

describe('ensureRpxUnit', () => {
  it('应该转为兼容 rpx 格式样式值', () => {
    expect(ensureRpxUnit('4rpx')).toBe('4rpx')
    expect(ensureRpxUnit('4')).toBe('4rpx')
    expect(ensureRpxUnit('4px')).toBe('4px')
    expect(ensureRpxUnit(4)).toBe('4rpx')
    expect(ensureRpxUnit('auto')).toBe('auto')
  })
})
describe('replaceNBSP', () => {
  it('应该替换字符串中的&nbsp;为不换行空格', () => {
    const data = [
      { name: 'John&nbsp;Doe', age: 30 },
      { name: 'Jane&nbsp;&nbsp;Smith', age: 25 },
    ]

    const result = replaceNBSP(data, 'name')

    expect((result[0] as any).name).toBe('John\u00A0\u00A0Doe')
    expect((result[1] as any).name).toBe('Jane\u00A0\u00A0\u00A0\u00A0Smith')
    // 原始数据应该保持不变
    expect((data[0] as any).name).toBe('John&nbsp;Doe')
  })

  it('应该处理Vue ref包装的数据', () => {
    const refData = {
      value: [
        { desc: 'Product&nbsp;Info', price: 99 },
        { desc: 'Service&nbsp;&nbsp;Details', price: 50 },
      ],
    }

    const result = replaceNBSP(refData, 'desc')

    expect((result[0] as any).desc).toBe('Product\u00A0\u00A0Info')
    expect((result[1] as any).desc).toBe('Service\u00A0\u00A0\u00A0\u00A0Details')
    // 原始数据应该保持不变
    expect((refData.value[0] as any).desc).toBe('Product&nbsp;Info')
  })

  it('应该忽略非字符串字段', () => {
    const data = [
      { name: 'John', count: 10 },
      { name: 'Jane', count: 20 },
    ]

    const result = replaceNBSP(data, 'count')

    // 因为count是数字，所以不应该被修改
    expect(result).toEqual(data)
    // 但结果应该是一个新的数组
    expect(result).not.toBe(data)
  })

  it('应该在空数组情况下返回空数组', () => {
    const emptyData: Array<Record<string, any>> = []

    const result = replaceNBSP(emptyData, 'name')

    expect(result).toEqual([])
  })
})
