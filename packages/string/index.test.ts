import { describe, expect, it } from 'vitest'
import { camelToKebab, capitalize, isEmptyString, kebabToCamel, truncate } from './index'

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
