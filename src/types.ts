/**
 * 类型检查相关的工具函数
 */

/**
 * 检查值是否为字符串类型
 * @param val 要检查的值
 * @returns 如果是字符串则返回 true，否则返回 false
 */
export function isString(val: unknown): val is string {
  return typeof val === 'string'
}

/**
 * 检查值是否为数字类型
 * @param val 要检查的值
 * @returns 如果是数字则返回 true，否则返回 false
 */
export function isNumber(val: unknown): val is number {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * 检查值是否为布尔类型
 * @param val 要检查的值
 * @returns 如果是布尔值则返回 true，否则返回 false
 */
export function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean'
}

/**
 * 检查值是否为函数类型
 * @param val 要检查的值
 * @returns 如果是函数则返回 true，否则返回 false
 */
export function isFunction(val: unknown): val is ((...args: any[]) => any) {
  return typeof val === 'function'
}

/**
 * 检查值是否为对象类型
 * @param val 要检查的值
 * @returns 如果是对象则返回 true，否则返回 false
 */
export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object'
}

/**
 * 检查值是否为数组类型
 * @param val 要检查的值
 * @returns 如果是数组则返回 true，否则返回 false
 */
export function isArray(val: unknown): val is any[] {
  return Array.isArray(val)
}

/**
 * 检查值是否为日期类型
 * @param val 要检查的值
 * @returns 如果是日期则返回 true，否则返回 false
 */
export function isDate(val: unknown): val is Date {
  return val instanceof Date
}

/**
 * 检查值是否为 undefined
 * @param val 要检查的值
 * @returns 如果是 undefined 则返回 true，否则返回 false
 */
export function isUndefined(val: unknown): val is undefined {
  return typeof val === 'undefined'
}

/**
 * 检查值是否为 null
 * @param val 要检查的值
 * @returns 如果是 null 则返回 true，否则返回 false
 */
export function isNull(val: unknown): val is null {
  return val === null
}

/**
 * 检查值是否为 null 或 undefined
 * @param val 要检查的值
 * @returns 如果是 null 或 undefined 则返回 true，否则返回 false
 */
export function isNullOrUndefined(val: unknown): val is null | undefined {
  return isNull(val) || isUndefined(val)
}

/**
 * 检查值是否为空（null、undefined、空字符串、空数组或空对象）
 * @param val 要检查的值
 * @returns 如果是空值则返回 true，否则返回 false
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
 * @returns 值是否为 NaN
 */
export function isNaN(value: unknown): boolean {
  return Number.isNaN(value)
}
