/**
 * @module 类型检查
 * @description 提供各种数据类型检查函数，用于判断值的类型、判断对象特性等
 */

/**
 * 检查值是否为字符串类型
 * @param val 要检查的值
 * @returns 如果是字符串则返回 true，否则返回 false
 * @example
 * ```ts
 * isString('hello') // true
 * isString(123) // false
 * isString(new String('hello')) // false（注意：包装对象不是原始字符串类型）
 * ```
 */
export function isString(val: unknown): val is string {
  return typeof val === 'string'
}

/**
 * 检查值是否为数字类型
 * @param val 要检查的值
 * @returns 如果是数字则返回 true，否则返回 false（NaN 会返回 false）
 * @example
 * ```ts
 * isNumber(123) // true
 * isNumber(-45.67) // true
 * isNumber('123') // false
 * isNumber(NaN) // false
 * isNumber(Infinity) // true
 * ```
 */
export function isNumber(val: unknown): val is number {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * 检查值是否为布尔类型
 * @param val 要检查的值
 * @returns 如果是布尔值则返回 true，否则返回 false
 * @example
 * ```ts
 * isBoolean(true) // true
 * isBoolean(false) // true
 * isBoolean(0) // false
 * isBoolean('false') // false
 * isBoolean(new Boolean(true)) // false（包装对象不是原始布尔类型）
 * ```
 */
export function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean'
}

/**
 * 检查值是否为函数类型
 * @param val 要检查的值
 * @returns 如果是函数则返回 true，否则返回 false
 * @example
 * ```ts
 * isFunction(() => {}) // true
 * isFunction(function() {}) // true
 * isFunction(class {}) // true
 * isFunction(Math.sin) // true
 * isFunction({}) // false
 * ```
 */
export function isFunction(val: unknown): val is ((...args: any[]) => any) {
  return typeof val === 'function'
}

/**
 * 检查值是否为对象类型（不包括 null）
 * @param val 要检查的值
 * @returns 如果是对象则返回 true，否则返回 false
 * @example
 * ```ts
 * isObject({}) // true
 * isObject([]) // true（数组也是对象）
 * isObject(new Date()) // true
 * isObject(null) // false
 * isObject(undefined) // false
 * isObject(123) // false
 * ```
 */
export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object'
}

/**
 * 检查值是否为数组类型
 * @param val 要检查的值
 * @returns 如果是数组则返回 true，否则返回 false
 * @example
 * ```ts
 * isArray([]) // true
 * isArray([1, 2, 3]) // true
 * isArray(new Array()) // true
 * isArray({}) // false
 * isArray('abc') // false
 * ```
 */
export function isArray(val: unknown): val is any[] {
  return Array.isArray(val)
}

/**
 * 检查值是否为日期类型
 * @param val 要检查的值
 * @returns 如果是日期对象则返回 true，否则返回 false
 * @example
 * ```ts
 * isDate(new Date()) // true
 * isDate(Date.now()) // false（时间戳是数字，不是日期对象）
 * isDate('2023-05-15') // false（日期字符串不是日期对象）
 * ```
 */
export function isDate(val: unknown): val is Date {
  return val instanceof Date
}

/**
 * 检查值是否为 undefined
 * @param val 要检查的值
 * @returns 如果是 undefined 则返回 true，否则返回 false
 * @example
 * ```ts
 * isUndefined(undefined) // true
 * isUndefined(void 0) // true
 * isUndefined(null) // false
 * isUndefined('') // false
 * ```
 */
export function isUndefined(val: unknown): val is undefined {
  return typeof val === 'undefined'
}

/**
 * 检查值是否为 null
 * @param val 要检查的值
 * @returns 如果是 null 则返回 true，否则返回 false
 * @example
 * ```ts
 * isNull(null) // true
 * isNull(undefined) // false
 * isNull(0) // false
 * isNull('') // false
 * ```
 */
export function isNull(val: unknown): val is null {
  return val === null
}

/**
 * 检查值是否为 null 或 undefined
 * @param val 要检查的值
 * @returns 如果是 null 或 undefined 则返回 true，否则返回 false
 * @example
 * ```ts
 * isNullOrUndefined(null) // true
 * isNullOrUndefined(undefined) // true
 * isNullOrUndefined(void 0) // true
 * isNullOrUndefined('') // false
 * isNullOrUndefined(0) // false
 * ```
 */
export function isNullOrUndefined(val: unknown): val is null | undefined {
  return isNull(val) || isUndefined(val)
}

/**
 * 检查值是否为空（null、undefined、空字符串、空数组或空对象）
 * @param val 要检查的值
 * @returns 如果是空值则返回 true，否则返回 false
 * @example
 * ```ts
 * isEmpty(null) // true
 * isEmpty(undefined) // true
 * isEmpty('') // true
 * isEmpty('   ') // true（空白字符串也视为空）
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty(0) // false
 * isEmpty(false) // false
 * isEmpty(' hello ') // false
 * ```
 */
export function isEmpty(val: unknown): boolean {
  if (isNullOrUndefined(val))
    return true
  if (isString(val))
    return val.trim().length === 0
  if (isArray(val))
    return val.length === 0
  if (isObject(val))
    return Object.keys(val).length === 0
  return false
}

/**
 * 检查值是否为 NaN
 * @param value 要检查的值
 * @returns 如果值是 NaN 则返回 true，否则返回 false
 * @example
 * ```ts
 * isNaN(NaN) // true
 * isNaN(Number('abc')) // true
 * isNaN(0 / 0) // true
 * isNaN(123) // false
 * isNaN('123') // false（不同于全局 isNaN，此函数不会先尝试转换为数字）
 * ```
 */
export function isNaN(value: unknown): boolean {
  return Number.isNaN(value)
}
