import { describe, expect, it } from 'vitest'
import { getQueryStringify, parseQueryString } from './index'

describe('getQueryStringify', () => {
  it('应该返回带有?前缀的查询字符串', () => {
    const params = { name: 'John', age: 30 }
    const result = getQueryStringify(params)
    expect(result).toBe('?name=John&age=30')
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

describe('parseQueryString', () => {
  it('应该解析基本的查询字符串', () => {
    const query = '?name=John&age=30&isDeveloper=true'
    expect(parseQueryString(query)).toEqual({
      name: 'John',
      age: 30,
      isDeveloper: true,
    })
  })

  it('应该能正确截取完整 URL 中的查询参数', () => {
    const url = 'https://example.com/api/user?id=123&active=false'
    expect(parseQueryString(url)).toEqual({
      id: 123,
      active: false,
    })
  })

  it('应该忽略 URL 的 hash 部分', () => {
    const url = 'https://example.com/page?ref=abc#section-1'
    expect(parseQueryString(url)).toEqual({
      ref: 'abc',
    })
  })

  it('应该正确转换各种类型（布尔值、数字、JSON）', () => {
    const query = 'b1=true&b2=false&num=12.34&strNum=0123&nullVal=null&undefVal=undefined'
    expect(parseQueryString(query)).toEqual({
      b1: true,
      b2: false,
      num: 12.34,
      strNum: '0123',
      nullVal: null,
      undefVal: undefined,
    })
  })

  it('应该正确解析 JSON 格式的参数值', () => {
    const query = 'user=%7B%22name%22%3A%22Tom%22%2C%22age%22%3A20%7D&list=%5B1%2C2%2C3%5D'
    expect(parseQueryString(query)).toEqual({
      user: { name: 'Tom', age: 20 },
      list: [1, 2, 3],
    })
  })

  it('应该把相同 key 的多个值合并为数组', () => {
    const query = 'tags=js&tags=ts&tags=css'
    expect(parseQueryString(query)).toEqual({
      tags: ['js', 'ts', 'css'],
    })
  })

  it('设置 parseTypes 为 false 时，应保持所有值为 string', () => {
    const query = 'age=30&isDeveloper=true&tags=js&tags=ts'
    expect(parseQueryString(query, { parseTypes: false })).toEqual({
      age: '30',
      isDeveloper: 'true',
      tags: ['js', 'ts'],
    })
  })

  it('应该处理空字符串、无问号或无效的输入', () => {
    expect(parseQueryString('')).toEqual({})
    expect(parseQueryString('https://example.com/no-params')).toEqual({})
    expect(parseQueryString('?')).toEqual({})
    expect(parseQueryString('?emptyKey=')).toEqual({ emptyKey: '' })
  })
})
