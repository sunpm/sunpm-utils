import { describe, expect, it } from 'vitest'
import { appendQuery, ensureLeadingSlash, getQueryStringify, parseQueryString, stripLeadingSlash } from './index'

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

describe('ensureLeadingSlash', () => {
  it('如果不以 / 开头，应补全 /', () => {
    expect(ensureLeadingSlash('foo/bar')).toBe('/foo/bar')
    expect(ensureLeadingSlash('path')).toBe('/path')
  })

  it('如果已以 / 开头，应保持不变', () => {
    expect(ensureLeadingSlash('/foo/bar')).toBe('/foo/bar')
    expect(ensureLeadingSlash('/')).toBe('/')
  })

  it('对于空值或未定义应返回空字符串', () => {
    expect(ensureLeadingSlash('')).toBe('')
    expect(ensureLeadingSlash(null)).toBe('')
    expect(ensureLeadingSlash(undefined)).toBe('')
  })
})

describe('stripLeadingSlash', () => {
  it('如果以 / 开头，应移除前导 /', () => {
    expect(stripLeadingSlash('/foo/bar')).toBe('foo/bar')
    expect(stripLeadingSlash('/path')).toBe('path')
    expect(stripLeadingSlash('/')).toBe('')
  })

  it('如果不以 / 开头，应保持不变', () => {
    expect(stripLeadingSlash('foo/bar')).toBe('foo/bar')
    expect(stripLeadingSlash('path')).toBe('path')
  })

  it('对于空值或未定义应返回空字符串', () => {
    expect(stripLeadingSlash('')).toBe('')
    expect(stripLeadingSlash(null)).toBe('')
    expect(stripLeadingSlash(undefined)).toBe('')
  })
})

describe('appendQuery', () => {
  it('应该能成功向不带查询参数的 URL 追加参数', () => {
    expect(appendQuery('https://example.com/page', { name: 'Tom', age: 25 }))
      .toBe('https://example.com/page?name=Tom&age=25')
  })

  it('应该能正确向已包含查询参数的 URL 追加参数', () => {
    expect(appendQuery('https://example.com/page?tab=1', { name: 'Tom' }))
      .toBe('https://example.com/page?tab=1&name=Tom')
  })

  it('应该正确处理带有 hash # 的 URL 并将参数拼接到 hash 之前', () => {
    expect(appendQuery('https://example.com/page#section-1', { name: 'Tom' }))
      .toBe('https://example.com/page?name=Tom#section-1')

    expect(appendQuery('https://example.com/page?tab=1#section-1', { name: 'Tom' }))
      .toBe('https://example.com/page?tab=1&name=Tom#section-1')
  })

  it('应该支持相对路径或小程序页面路径（如 /pages/login/index）', () => {
    expect(appendQuery('/pages/login/index', { redirect: '/home' }))
      .toBe('/pages/login/index?redirect=%2Fhome')

    expect(appendQuery('/pages/login/index?type=wx', { redirect: '/home' }))
      .toBe('/pages/login/index?type=wx&redirect=%2Fhome')
  })

  it('当 params 为空对象、null 或 undefined 时，保持原始 URL 不变', () => {
    expect(appendQuery('https://example.com/page', {})).toBe('https://example.com/page')
    expect(appendQuery('https://example.com/page', null)).toBe('https://example.com/page')
    expect(appendQuery('https://example.com/page', undefined)).toBe('https://example.com/page')
    expect(appendQuery('https://example.com/page', 'not-an-object' as any)).toBe('https://example.com/page')
    expect(appendQuery('', { name: 'Tom' })).toBe('')
  })

  it('应该过滤掉 null 和 undefined 的参数值', () => {
    expect(appendQuery('https://example.com/page', { name: 'Tom', empty: null, undef: undefined }))
      .toBe('https://example.com/page?name=Tom')
  })

  it('应该支持传入 options 控制 URI 编码行为', () => {
    expect(appendQuery('https://example.com/page', { name: '张三', city: '北京' }, { encode: false }))
      .toBe('https://example.com/page?name=张三&city=北京')

    expect(appendQuery('https://example.com/page', { name: 'Tom' }, { encode: val => val.toUpperCase() }))
      .toBe('https://example.com/page?NAME=TOM')
  })
})
