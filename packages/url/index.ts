/**
 * 将对象转换为URL查询字符串
 *
 * @param {Record<string, any>} params - 需要转换的对象
 * @returns {string} 转换后的查询字符串，如果有参数则以?开头
 *
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

  const queryString = Object.entries(params) // 将对象转换成 [key, value] 数组
    .map(([key, value]) => encodeURI(
      `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`,
    )) // 将每个数组元素转换成 key=value 字符串，需要对 value 进行 JSON 序列化和 URL 编码
    .join('&') // 将数组用 & 符号连接成字符串

  if (queryString)
    return `?${queryString}`

  return queryString
}
