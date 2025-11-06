import { describe, expect, it } from 'vitest'
import {
  deepClone,
  deepMerge,
  filterObjectByKeys,
  get,
  hasOwnProp,
  invert,
  mapKeys,
  mapValues,
  merge,
  objectToQueryString,
  omit,
  pick,
} from './index'

describe('hasOwnProp', () => {
  it('应该检测自有属性', () => {
    const obj = { name: 'Tom', age: 25 }
    expect(hasOwnProp(obj, 'name')).toBe(true)
    expect(hasOwnProp(obj, 'toString')).toBe(false)
  })

  it('应该处理 symbol 键', () => {
    const sym = Symbol('test')
    const obj = { [sym]: 'value' }
    expect(hasOwnProp(obj, sym)).toBe(true)
  })
})

describe('deepClone', () => {
  it('应该深拷贝对象', () => {
    const original = { a: 1, b: { c: 2 }, d: [1, 2, 3] }
    const clone = deepClone(original)

    expect(clone).toEqual(original)
    expect(clone).not.toBe(original)
    expect(clone.b).not.toBe(original.b)
    expect(clone.d).not.toBe(original.d)

    // 修改克隆不应影响原始对象
    clone.b.c = 100
    expect(original.b.c).toBe(2)
  })

  it('应该处理基本类型', () => {
    expect(deepClone(123)).toBe(123)
    expect(deepClone('string')).toBe('string')
    expect(deepClone(null)).toBe(null)
    expect(deepClone(undefined)).toBe(undefined)
    expect(deepClone(true)).toBe(true)
  })

  it('应该处理日期和正则表达式', () => {
    const date = new Date()
    const clonedDate = deepClone(date)
    expect(clonedDate).toEqual(date)
    expect(clonedDate).not.toBe(date)

    const regex = /test/g
    const clonedRegex = deepClone(regex)
    expect(clonedRegex).toEqual(regex)
    expect(clonedRegex).not.toBe(regex)
  })
})

describe('get', () => {
  it('应该获取嵌套对象的值', () => {
    const obj = {
      user: {
        profile: { name: 'Tom', age: 25 },
        roles: ['admin'],
      },
    }

    expect(get(obj, 'user.profile.name')).toBe('Tom')
    expect(get(obj, 'user.roles.0')).toBe('admin')
  })

  it('在路径不存在时应返回默认值', () => {
    const obj = { a: 1 }

    expect(get(obj, 'b')).toBe(undefined)
    expect(get(obj, 'b', 'default')).toBe('default')
  })

  it('应处理 null 和 undefined 中间值', () => {
    const obj = { a: { b: null } }

    expect(get(obj, 'a.b.c')).toBe(undefined)
    expect(get(obj, 'a.b.c', 'default')).toBe('default')
  })
})

describe('pick', () => {
  it('应该选择对象的指定属性', () => {
    const user = { id: 1, name: 'Tom', age: 25, email: 'tom@example.com' }

    expect(pick(user, ['name', 'email'])).toEqual({ name: 'Tom', email: 'tom@example.com' })
  })

  it('应忽略不存在的键', () => {
    const user = { name: 'Tom' } as { name: string, gender?: string }

    expect(pick(user, ['name', 'gender'])).toEqual({ name: 'Tom' })
  })

  it('空键数组应返回空对象', () => {
    const user = { name: 'Tom' }

    expect(pick(user, [])).toEqual({})
  })
})

describe('omit', () => {
  it('应该排除对象的指定属性', () => {
    const user = { id: 1, name: 'Tom', age: 25, password: '123456' }

    expect(omit(user, ['password'])).toEqual({ id: 1, name: 'Tom', age: 25 })
    expect(omit(user, ['id', 'age'])).toEqual({ name: 'Tom', password: '123456' })
  })

  it('应忽略不存在的键', () => {
    const user = { name: 'Tom' } as { name: string, gender?: string }

    expect(omit(user, ['gender'])).toEqual({ name: 'Tom' })
  })

  it('空键数组应返回原对象的浅拷贝', () => {
    const user = { name: 'Tom' }
    const result = omit(user, [])

    expect(result).toEqual(user)
    expect(result).not.toBe(user)
  })
})

describe('objectToQueryString', () => {
  it('应该将对象转换为查询字符串', () => {
    expect(objectToQueryString({ name: 'Tom', age: 25 })).toBe('name=Tom&age=25')
  })

  it('应该处理特殊字符', () => {
    expect(objectToQueryString({ search: 'hello world' })).toBe('search=hello%20world')
  })

  it('应该处理数组值', () => {
    expect(objectToQueryString({ tags: ['js', 'ts'] })).toBe('tags=js&tags=ts')
  })

  it('应该过滤 null 和 undefined 值', () => {
    expect(objectToQueryString({ name: 'Tom', empty: null, missing: undefined })).toBe('name=Tom')
  })

  it('空对象应返回空字符串', () => {
    expect(objectToQueryString({})).toBe('')
  })
})

describe('merge', () => {
  it('应该合并多个对象', () => {
    expect(merge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
  })

  it('后面的对象属性应覆盖前面的', () => {
    expect(merge({ a: 1 }, { a: 2, b: 2 })).toEqual({ a: 2, b: 2 })
  })

  it('对象属性覆盖不是深度合并', () => {
    expect(merge({ a: { x: 1 } }, { a: { y: 2 } })).toEqual({ a: { y: 2 } })
  })

  it('应该处理多个对象', () => {
    expect(merge({}, { a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 })
  })
})

describe('deepMerge', () => {
  it('应该递归合并对象', () => {
    expect(deepMerge({ a: { x: 1 } }, { a: { y: 2 } })).toEqual({ a: { x: 1, y: 2 } })
  })

  it('应该处理简单属性', () => {
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
  })

  it('应直接替换数组，而不合并', () => {
    expect(deepMerge({ a: [1, 2] }, { a: [3, 4] })).toEqual({ a: [3, 4] })
  })

  it('应该处理嵌套深度对象', () => {
    expect(deepMerge(
      { a: { b: { c: 1 } } },
      { a: { b: { d: 2 }, e: 3 } },
    )).toEqual({ a: { b: { c: 1, d: 2 }, e: 3 } })
  })

  it('深拷贝对象，不共享引用', () => {
    const obj1 = { a: { b: 1 } }
    const result = deepMerge({}, obj1)

    result.a.b = 2
    expect(obj1.a.b).toBe(1)
  })
})

describe('filterObjectByKeys', () => {
  it('应该过滤和重命名对象属性', () => {
    const originalObject = { name: 'John', age: 30, gender: 'male', country: 'USA' }
    const keysToFilter = ['name', 'country']
    const keyMapping = { name: 'fullName', country: 'location' }

    const result = filterObjectByKeys(originalObject, keysToFilter, keyMapping)
    expect(result).toEqual({ fullName: 'John', location: 'USA' })
  })

  it('当没有提供键映射时应保留原始键名', () => {
    const originalObject = { name: 'John', age: 30 }
    const result = filterObjectByKeys(originalObject, ['name'])

    expect(result).toEqual({ name: 'John' })
  })

  it('当请求不存在的键时应忽略它们', () => {
    const originalObject = { name: 'John' }
    const result = filterObjectByKeys(originalObject, ['name', 'missing'])

    expect(result).toEqual({ name: 'John' })
  })

  it('空键数组应返回空对象', () => {
    const originalObject = { name: 'John' }
    const result = filterObjectByKeys(originalObject, [])

    expect(result).toEqual({})
  })
})

describe('mapKeys', () => {
  it('应该转换对象的键', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = mapKeys(obj, (value, key) => key.toUpperCase())
    expect(result).toEqual({ A: 1, B: 2, C: 3 })
  })

  it('应该支持添加前缀', () => {
    const obj = { a: 1, b: 2 }
    const result = mapKeys(obj, (value, key) => `prefix_${key}`)
    expect(result).toEqual({ prefix_a: 1, prefix_b: 2 })
  })

  it('应该可以访问原始对象', () => {
    const obj = { a: 1, b: 2 }
    const result = mapKeys(obj, (value, key, o) => {
      expect(o).toBe(obj)
      return key
    })
    expect(result).toEqual(obj)
  })
})

describe('mapValues', () => {
  it('应该转换对象的值', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = mapValues(obj, value => value * 2)
    expect(result).toEqual({ a: 2, b: 4, c: 6 })
  })

  it('应该从对象中提取属性', () => {
    const users = { user1: { age: 20 }, user2: { age: 30 } }
    const result = mapValues(users, user => user.age)
    expect(result).toEqual({ user1: 20, user2: 30 })
  })

  it('应该可以访问键和原始对象', () => {
    const obj = { a: 1, b: 2 }
    const result = mapValues(obj, (value, key, o) => {
      expect(o).toBe(obj)
      return `${key}:${value}`
    })
    expect(result).toEqual({ a: 'a:1', b: 'b:2' })
  })
})

describe('invert', () => {
  it('应该反转对象的键值对', () => {
    const obj = { a: '1', b: '2', c: '3' }
    const result = invert(obj)
    expect(result).toEqual({ 1: 'a', 2: 'b', 3: 'c' })
  })

  it('应该处理数字值', () => {
    const obj = { a: 1, b: 2 }
    const result = invert(obj)
    expect(result).toEqual({ 1: 'a', 2: 'b' })
  })

  it('重复的值应该使用最后的键', () => {
    const obj = { a: '1', b: '1' }
    const result = invert(obj)
    expect(result).toEqual({ 1: 'b' })
  })

  it('应该处理空对象', () => {
    const obj = {}
    const result = invert(obj)
    expect(result).toEqual({})
  })
})
