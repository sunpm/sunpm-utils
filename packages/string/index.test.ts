import { describe, expect, it } from 'vitest'
import { camelToKebab, capitalize, ensureRpxUnit, isEmptyString, kebabToCamel, parseJsonStr, replaceNBSP, truncate } from './index'

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
    expect(replaceNBSP('John&nbsp;Doe')).toBe('John Doe')
    expect(replaceNBSP('Jane&nbsp;&nbsp;Smith')).toBe('Jane  Smith')
  })

  it('应该忽略非字符串字段', () => {
    expect(replaceNBSP(123 as any as string)).toBe(123)
  })

  it('应该在未检测到 &nbsp; 情况下返回初始字符串', () => {
    expect(replaceNBSP('Smith')).toBe('Smith')
  })
})

describe('parseJsonStr', () => {
  it('应该正确解析有效的JSON对象', () => {
    const result = parseJsonStr('{"name": "Tom", "age": 25}')
    expect(result).toEqual({ name: 'Tom', age: 25 })
  })

  it('应该正确解析有效的JSON数组', () => {
    const result = parseJsonStr('[1, 2, 3, "hello"]')
    expect(result).toEqual([1, 2, 3, 'hello'])
  })

  it('应该正确解析JSON字符串', () => {
    expect(parseJsonStr('"hello world"')).toBe('hello world')
    expect(parseJsonStr('"123"')).toBe('123')
  })

  it('应该正确解析JSON数字', () => {
    expect(parseJsonStr('123')).toBe(123)
    expect(parseJsonStr('-45.67')).toBe(-45.67)
    expect(parseJsonStr('1.23e-4')).toBe(1.23e-4)
  })

  it('应该正确解析JSON布尔值和null', () => {
    expect(parseJsonStr('true')).toBe(true)
    expect(parseJsonStr('false')).toBe(false)
    expect(parseJsonStr('null')).toBe(null)
  })

  it('应该处理空值情况', () => {
    expect(parseJsonStr('')).toEqual({})
    expect(parseJsonStr(null)).toEqual({})
    expect(parseJsonStr(undefined)).toEqual({})
  })

  it('应该处理无效JSON并返回原字符串', () => {
    expect(parseJsonStr('{invalid json}')).toBe('{invalid json}')
    expect(parseJsonStr('[1, 2, 3')).toBe('[1, 2, 3')
    expect(parseJsonStr('hello world')).toBe('hello world')
  })

  it('应该正确处理带空格的JSON', () => {
    const result = parseJsonStr('  {"name": "Tom"}  ')
    expect(result).toEqual({ name: 'Tom' })
  })

  it('应该支持自定义默认值', () => {
    expect(parseJsonStr('invalid', null)).toBe(null)
    expect(parseJsonStr('invalid', { error: true })).toEqual({ error: true })
    expect(parseJsonStr('', 'default')).toBe('default')
  })

  it('应该处理嵌套的复杂JSON结构', () => {
    const complexJson = '{"users": [{"name": "Tom", "meta": {"age": 25, "active": true}}], "count": 1}'
    const result = parseJsonStr(complexJson)
    expect(result).toEqual({
      users: [{ name: 'Tom', meta: { age: 25, active: true } }],
      count: 1,
    })
  })

  it('应该处理非字符串输入', () => {
    expect(parseJsonStr(123 as any)).toBe(123)
    expect(parseJsonStr({} as any)).toEqual({})
    expect(parseJsonStr([] as any)).toEqual([])
  })
})
