/**
 * @module 对象操作
 * @description 提供各种对象处理函数，包括对象深拷贝、合并、转换等实用功能
 */

import { isPlainObject } from '../is'

/**
 * 检查对象是否具有指定的自有属性。
 *
 * @param {object} obj - 需要检查的对象
 * @param {string | symbol} prop - 需要检查的属性键
 * @returns {boolean} 如果对象具有该自有属性，则返回 true，否则返回 false
 * @group Object
 * @example
 * ```ts
 * const obj = { name: 'Tom', age: 25 }
 * hasOwnProp(obj, 'name') // true
 * hasOwnProp(obj, 'toString') // false，toString 是继承的属性
 * ```
 */
export function hasOwnProp(obj: object, prop: string | symbol): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

/**
 * 深拷贝对象，支持基本类型、数组、对象、日期和正则表达式
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象，与原对象完全独立
 * @group Object
 * @example
 * ```ts
 * const original = { a: 1, b: { c: 2 }, d: [1, 2, 3], e: new Date() }
 * const copy = deepClone(original)
 * copy.b.c = 100
 * console.log(original.b.c) // 2，原对象不受影响
 *
 * // 支持日期对象
 * const date = new Date()
 * const clonedDate = deepClone(date)
 * console.log(date === clonedDate) // false，不是同一引用
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as unknown as T
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T
  }

  const cloned: Record<string, any> = {}
  Object.keys(obj as Record<string, any>).forEach((key) => {
    cloned[key] = deepClone((obj as Record<string, any>)[key])
  })

  return cloned as T
}

/**
 * 从对象中获取指定路径的值，支持点分隔的嵌套路径
 * @param obj 源对象
 * @param path 属性路径，如 'user.address.street'
 * @param defaultValue 默认值，当路径不存在时返回
 * @returns 路径对应的值，如果路径不存在则返回默认值
 * @group Object
 * @example
 * ```ts
 * const obj = { user: { profile: { name: 'Tom', age: 25 }, roles: ['admin'] } }
 *
 * get(obj, 'user.profile.name') // 'Tom'
 * get(obj, 'user.roles.0') // 'admin'
 * get(obj, 'user.settings', { theme: 'dark' }) // { theme: 'dark' }（路径不存在，返回默认值）
 * get(obj, 'user.profile.gender') // undefined（路径不存在且没提供默认值）
 * get(obj, 'user.profile.gender', 'unknown') // 'unknown'（使用默认值）
 * ```
 */
export function get<T = any>(obj: Record<string, any>, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.')
  let result = obj

  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue
    }
    result = result[key]
  }

  return (result === undefined) ? defaultValue : result as T
}

/**
 * 从对象中选择指定的属性，创建一个新对象
 * @param obj 原始对象
 * @param keys 要选择的键数组
 * @returns 包含指定键的新对象
 * @group Object
 * @example
 * ```ts
 * @group Object
 * const user = { id: 1, name: 'Tom', age: 25, email: 'tom@example.com' }
 *
 * @group Object
 * pick(user, ['name', 'email']) // { name: 'Tom', email: 'tom@example.com' }
 * pick(user, ['name', 'gender']) // { name: 'Tom' }（不存在的键会被忽略）
 * pick(user, []) // {}（空数组返回空对象）
 * ```
 */
export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
    return result
  }, {} as Pick<T, K>)
}

/**
 * 从对象中排除指定的属性，创建一个新对象
 * @param obj 原始对象
 * @param keys 要排除的键数组
 * @returns 不包含指定键的新对象
 * @group Object
 * @example
 * ```ts
 * const user = { id: 1, name: 'Tom', age: 25, password: '123456' }
 *
 * omit(user, ['password']) // { id: 1, name: 'Tom', age: 25 }
 * omit(user, ['id', 'age']) // { name: 'Tom', password: '123456' }
 * omit(user, ['nonExistent']) // 原对象的拷贝，不存在的键会被忽略
 * ```
 */
export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => {
    delete result[key]
  })
  return result
}

/**
 * 将对象转换为 URL 查询字符串
 * @param obj 要转换的对象
 * @returns 格式化后的查询字符串（不包含前导?）
 * @group Object
 * @example
 * ```ts
 * objectToQueryString({ name: 'Tom', age: 25 }) // 'name=Tom&age=25'
 * objectToQueryString({ search: 'hello world', page: 1 }) // 'search=hello%20world&page=1'
 * objectToQueryString({ tags: ['js', 'ts'] }) // 'tags=js&tags=ts'
 * objectToQueryString({ name: 'Tom', empty: null }) // 'name=Tom'（null 和 undefined 会被过滤）
 * ```
 */
export function objectToQueryString(obj: Record<string, any>): string {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(item => `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`).join('&')
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    })
    .join('&')
}

/**
 * 合并多个对象，后面的对象的属性会覆盖前面的
 * @param objects 要合并的对象数组
 * @returns 合并后的新对象
 * @group Object
 * @example
 * ```ts
 * merge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
 * merge({ a: 1 }, { a: 2, b: 2 }) // { a: 2, b: 2 }（后面对象的属性会覆盖前面的）
 * merge({ a: { x: 1 } }, { a: { y: 2 } }) // { a: { y: 2 } }（不是深度合并）
 * merge({}, { a: 1 }, { b: 2 }, { c: 3 }) // { a: 1, b: 2, c: 3 }
 * ```
 */
export function merge<T extends Record<string, any>>(...objects: T[]): T {
  return Object.assign({}, ...objects)
}

/**
 * 深度合并多个对象，会递归合并嵌套对象
 * @param objects 要合并的对象数组
 * @returns 深度合并后的新对象
 * @group Object
 * @example
 * ```ts
 * deepMerge({ a: { x: 1 } }, { a: { y: 2 } }) // { a: { x: 1, y: 2 } }
 * deepMerge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
 * deepMerge({ a: [1, 2] }, { a: [3, 4] }) // { a: [3, 4] }（数组会被替换，不会合并）
 * deepMerge({}, { a: null }, { a: { b: 2 } }) // { a: { b: 2 } }（null 会被后面的对象覆盖）
 * ```
 */
export function deepMerge(...objects: Record<string, any>[]): Record<string, any> {
  const result: Record<string, any> = {}

  objects.forEach((obj) => {
    if (!isPlainObject(obj))
      return

    Object.keys(obj).forEach((key) => {
      const sourceValue = obj[key]
      const targetValue = result[key]

      // 如果两个值都是对象，就递归合并
      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue)
      }
      else {
        // 否则直接覆盖
        result[key] = deepClone(sourceValue)
      }
    })
  })

  return result
}

/**
 * 根据传入的键数组和键名映射对象过滤并重命名对象，返回一个新对象
 * @param originalObject 要过滤的原始对象
 * @param keysArray 要保留的键名数组
 * @param keyMapping 可选的键名映射对象，格式为 { 原键名: 新键名 }
 * @returns 返回一个新对象，其中只包含原对象中匹配的键值对，并根据映射重命名键
 * @group Object
 * @example
 * ```ts
 * const originalObject = { name: "John", age: 30, gender: "male", country: "USA" }
 * const keysToFilter = ["name", "country"]
 * const keyMapping = { name: "fullName", country: "location" }
 * const result = filterObjectByKeys(originalObject, keysToFilter, keyMapping)
 * // 结果: { fullName: 'John', location: 'USA' }
 * ```
 */
export function filterObjectByKeys(
  originalObject: Record<string, any>,
  keysArray: string[],
  keyMapping: Record<string, string> = {},
): Record<string, any> {
  return keysArray.reduce((newObject: Record<string, any>, key: string) => {
    if (hasOwnProp(originalObject, key)) {
      const newKey = keyMapping[key] || key // 如果有映射，就用新键名，否则用原键名
      newObject[newKey] = originalObject[key]
    }
    return newObject
  }, {})
}

/**
 * 创建一个新对象，通过函数转换每个键
 * @param obj 原始对象
 * @param iteratee 转换函数，接收值、键和对象，返回新的键名
 * @returns 转换后的新对象
 * @group Object
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 }
 * mapKeys(obj, (value, key) => key.toUpperCase())
 * // { A: 1, B: 2, C: 3 }
 *
 * mapKeys(obj, (value, key) => `prefix_${key}`)
 * // { prefix_a: 1, prefix_b: 2, prefix_c: 3 }
 * ```
 */
export function mapKeys<T extends Record<string, any>>(
  obj: T,
  iteratee: (value: T[keyof T], key: string, obj: T) => string,
): Record<string, T[keyof T]> {
  const result: Record<string, T[keyof T]> = {}

  Object.keys(obj).forEach((key) => {
    const newKey = iteratee(obj[key], key, obj)
    result[newKey] = obj[key]
  })

  return result
}

/**
 * 创建一个新对象，通过函数转换每个值
 * @param obj 原始对象
 * @param iteratee 转换函数，接收值、键和对象，返回新的值
 * @returns 转换后的新对象
 * @group Object
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 }
 * mapValues(obj, value => value * 2)
 * // { a: 2, b: 4, c: 6 }
 *
 * const users = { user1: { age: 20 }, user2: { age: 30 } }
 * mapValues(users, user => user.age)
 * // { user1: 20, user2: 30 }
 * ```
 */
export function mapValues<T extends Record<string, any>, R>(
  obj: T,
  iteratee: (value: T[keyof T], key: string, obj: T) => R,
): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>

  Object.keys(obj).forEach((key) => {
    result[key as keyof T] = iteratee(obj[key], key, obj)
  })

  return result
}

/**
 * 反转对象的键值对，值变成键，键变成值
 * @param obj 原始对象
 * @returns 反转后的新对象
 * @group Object
 * @example
 * ```ts
 * invert({ a: '1', b: '2', c: '3' })
 * // { '1': 'a', '2': 'b', '3': 'c' }
 *
 * invert({ firstName: 'John', lastName: 'Doe' })
 * // { John: 'firstName', Doe: 'lastName' }
 *
 * // 注意：如果有重复的值，后面的键会覆盖前面的
 * invert({ a: '1', b: '1' })
 * // { '1': 'b' }
 * ```
 */
export function invert<T extends Record<string, string | number>>(
  obj: T,
): Record<string, string> {
  const result: Record<string, string> = {}

  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    result[String(value)] = key
  })

  return result
}
