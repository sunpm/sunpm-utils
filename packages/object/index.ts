/**
 * @module 对象操作
 * @description 提供各种对象处理函数，包括对象深拷贝、合并、转换等实用功能
 */

/**
 * 深拷贝对象，支持基本类型、数组、对象、日期和正则表达式
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象，与原对象完全独立
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
 * @example
 * ```ts
 * const user = { id: 1, name: 'Tom', age: 25, email: 'tom@example.com' }
 *
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
