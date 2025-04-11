import { describe, expect, it } from 'vitest'
import { getQueryStringify } from './index'

describe('getQueryStringify', () => {
  it('应该返回带有?前缀的查询字符串', () => {
    const params = { name: 'John', age: 30 }
    const result = getQueryStringify(params)
    expect(result).toBe('?name=John&age=30')
  })

  it('应该正确处理对象类型的值', () => {
    const params = { user: { name: 'John', age: 30 }, active: true }
    const result = getQueryStringify(params)
    expect(result).toBe(`?user=${encodeURI(JSON.stringify({ name: 'John', age: 30 }))}&active=true`)
  })

  it('应该在空对象情况下返回空字符串', () => {
    const params = {}
    const result = getQueryStringify(params)
    expect(result).toBe('')
  })

  it('应该在null或undefined情况下返回空字符串', () => {
    expect(getQueryStringify(null)).toBe('')
    expect(getQueryStringify(undefined)).toBe('')
  })
})
