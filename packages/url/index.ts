import { objectToQueryString } from '../object'

/**
 * 将对象转换为URL查询字符串
 *
 * @deprecated 请使用 objectToQueryString 函数代替，它在 object 模块中。该函数将在下一个主要版本中移除。
 * @param {Record<string, any>} params - 需要转换的对象
 * @returns {string} 转换后的查询字符串，如果有参数则以?开头
 * @group Url
 * @example
 * ```ts
 * // 基本用法
 * getQueryStringify({ name: 'John', age: 30 })
 * // 返回: ?name=John&age=30
 *
 * // 包含对象的情况
 * getQueryStringify({ user: { name: 'John', age: 30 }, active: true })
 * // 返回: ?user={"name":"John","age":30}&active=true
 *
 * // 空对象
 * getQueryStringify({})
 * // 返回: ''
 *
 * // null 或 undefined
 * getQueryStringify(null)
 * // 返回: ''
 * ```
 */
export function getQueryStringify(params: Record<string, any> | null | undefined): string {
  if (!params)
    return ''

  const queryString = objectToQueryString(params)

  if (queryString)
    return `?${queryString}`

  return ''
}
