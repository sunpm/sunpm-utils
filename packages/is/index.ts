/**
 * @module 类型检查
 * @description 提供各种数据类型检查函数，用于判断值的类型、判断对象特性等
 */

/**
 * 检查值是否为字符串类型
 * @param val 要检查的值
 * @returns 如果是字符串则返回 true，否则返回 false
 * @group Is
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
 * @group Is
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
 * @group Is
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
 * @group Is
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
 * 检查值是否为类构造函数
 * @param val 要检查的值
 * @returns 如果是类构造函数则返回 true，否则返回 false
 * @group Is
 * @example
 * ```ts
 * isClass(class User {}) // true
 * isClass(class extends Array {}) // true
 * isClass(Array) // true
 * isClass(Date) // true
 * isClass(function() {}) // false
 * isClass(() => {}) // false
 * isClass(Math.sin) // false
 * isClass({}) // false
 * ```
 */
export function isClass(val: unknown): val is new (...args: any[]) => any {
  if (!isFunction(val)) {
    return false
  }

  const func = val as (...args: any[]) => any

  // 检查函数的字符串表示是否以 class 开头（ES6 类）
  const funcStr = func.toString()
  if (/^class\s/.test(funcStr)) {
    return true
  }

  // 检查是否为内置构造函数或传统构造函数
  // 构造函数通常有 prototype 属性，且 prototype.constructor 指向自己
  const funcWithPrototype = func as any
  if (funcWithPrototype.prototype && funcWithPrototype.prototype.constructor === funcWithPrototype) {
    // 进一步检查：尝试检测是否为箭头函数（箭头函数没有 prototype）
    // 或者是否为明显的工具函数（通过一些启发式规则）
    if (!/^[a-z]/.test(funcWithPrototype.name || '')) {
      // 如果函数名不是以小写字母开头，更可能是构造函数
      return true
    }

    // 检查是否为内置构造函数
    if (/\[native code\]/.test(funcStr)) {
      return true
    }
  }

  return false
}

/**
 * 检查值是否为对象类型（不包括 null）
 * @param val 要检查的值
 * @returns 如果是对象则返回 true，否则返回 false
 * @group Is
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
 * @group Is
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
 * @group Is
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
 * 检查值是否为正则表达式
 * @param val 要检查的值
 * @returns 如果是正则表达式则返回 true，否则返回 false
 * @group Is
 * @example
 * ```ts
 * isRegExp(/abc/) // true
 * isRegExp(new RegExp('abc')) // true
 * isRegExp('/abc/') // false（字符串不是正则表达式）
 * isRegExp({}) // false
 * ```
 */
export function isRegExp(val: unknown): val is RegExp {
  return val instanceof RegExp
}

/**
 * 检查值是否为 Promise
 * @param val 要检查的值
 * @returns 如果是 Promise 则返回 true，否则返回 false
 * @group Is
 * @example
 * ```ts
 * isPromise(Promise.resolve()) // true
 * isPromise(new Promise(() => {})) // true
 * isPromise({ then: () => {}, catch: () => {} }) // true（类 Promise 对象也会返回 true）
 * isPromise({}) // false
 * isPromise(null) // false
 * ```
 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction((val as any).then) && isFunction((val as any).catch)
}

/**
 * 检查值是否为 Map
 * @param val 要检查的值
 * @returns 如果是 Map 则返回 true，否则返回 false
 * @group Is
 * @example
 * ```ts
 * isMap(new Map()) // true
 * isMap(new WeakMap()) // false
 * isMap({}) // false
 * ```
 */
export function isMap<K = any, V = any>(val: unknown): val is Map<K, V> {
  return val instanceof Map
}

/**
 * 检查值是否为 Set
 * @param val 要检查的值
 * @returns 如果是 Set 则返回 true，否则返回 false
 * @group Is
 * @example
 * ```ts
 * isSet(new Set()) // true
 * isSet(new WeakSet()) // false
 * isSet([]) // false
 * ```
 */
export function isSet<T = any>(val: unknown): val is Set<T> {
  return val instanceof Set
}

/**
 * 检查值是否为 Symbol
 * @param val 要检查的值
 * @returns 如果是 Symbol 则返回 true，否则返回 false
 * @group Is
 * @example
 * ```ts
 * isSymbol(Symbol('foo')) // true
 * isSymbol(Symbol.for('bar')) // true
 * isSymbol('symbol') // false
 * ```
 */
export function isSymbol(val: unknown): val is symbol {
  return typeof val === 'symbol'
}

/**
 * 检查值是否为原始类型（string、number、boolean、symbol、bigint、null、undefined）
 * @param val 要检查的值
 * @returns 如果是原始类型则返回 true，否则返回 false
 * @group Is
 * @example
 * ```ts
 * isPrimitive('hello') // true
 * isPrimitive(123) // true
 * isPrimitive(true) // true
 * isPrimitive(Symbol()) // true
 * isPrimitive(null) // true
 * isPrimitive(undefined) // true
 * isPrimitive(BigInt(123)) // true
 * isPrimitive({}) // false
 * isPrimitive([]) // false
 * isPrimitive(() => {}) // false
 * ```
 */
export function isPrimitive(val: unknown): boolean {
  return val === null || (typeof val !== 'object' && typeof val !== 'function')
}

/**
 * 检查值是否为 undefined
 * @param val 要检查的值
 * @returns 如果是 undefined 则返回 true，否则返回 false
 * @group Is
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
 * @group Is
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
 * @group Is
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
 * 检查对象是否为空对象（没有自身可枚举属性）
 * @param val 要检查的值
 * @returns 如果是空对象则返回 true，否则返回 false；如果不是对象类型则返回 false
 * @group Is
 * @example
 * ```ts
 * isEmptyObject({}) // true
 * isEmptyObject({ a: 1 }) // false
 * isEmptyObject([]) // true（空数组也会返回 true）
 * isEmptyObject(null) // false（不是对象）
 * isEmptyObject(Object.create(null)) // true
 * isEmptyObject(Object.create({ toString: () => '' })) // true（不包括继承的属性）
 * ```
 */
export function isEmptyObject(val: unknown): boolean {
  return isObject(val) && Object.keys(val).length === 0
}

/**
 * 检查值是否为空（null、undefined、空字符串、空数组或空对象）
 * @param val 要检查的值
 * @returns 如果是空值则返回 true，否则返回 false
 * @group Is
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
    return isEmptyObject(val)
  return false
}

/**
 * 检查值是否为 NaN
 * @param value 要检查的值
 * @returns 如果值是 NaN 则返回 true，否则返回 false
 * @group Is
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

/**
 * 检查值是否为普通对象（由 Object 构造函数创建或对象字面量）
 *
 * @param {unknown} value - 要检查的值
 * @returns {boolean} 如果值是普通对象则返回 true，否则返回 false
 *
 * @group Is
 * @example
 * ```ts
 * isPlainObject({}) // true
 * isPlainObject({ a: 1 }) // true
 * isPlainObject(new Date()) // false
 * isPlainObject([]) // false
 * isPlainObject(null) // false
 * ```
 */
export function isPlainObject(value: unknown): value is Record<string, any> {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}
