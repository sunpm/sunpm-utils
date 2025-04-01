import { describe, expect, it } from 'vitest'
import { isEmpty } from '../index'

describe('isEmpty', () => {
  it('应该识别 null 和 undefined 为空', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
  })

  it('应该识别空字符串为空', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('hello')).toBe(false)
  })

  it('应该识别空数组为空', () => {
    expect(isEmpty([])).toBe(true)
    expect(isEmpty([1, 2, 3])).toBe(false)
  })

  it('应该识别空对象为空', () => {
    expect(isEmpty({})).toBe(true)
    expect(isEmpty({ a: 1 })).toBe(false)
  })

  it('应该处理数字和布尔值', () => {
    expect(isEmpty(0)).toBe(false)
    expect(isEmpty(42)).toBe(false)
    expect(isEmpty(false)).toBe(false)
    expect(isEmpty(true)).toBe(false)
  })
})
