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

export interface ParseQueryStringOptions {
  /**
   * 是否自动转换值的类型（如 "true" -> true, "false" -> false, 数字字符串转为 number, JSON 字符串转为对象/数组）
   * @default true
   */
  parseTypes?: boolean
}

/**
 * 将 URL 查询参数字符串解析为 JavaScript 对象（字面量）
 *
 * @param {string} url - 需要解析的 URL 字符串或查询参数字符串
 * @param {ParseQueryStringOptions} [options] - 解析选项
 * @returns {Record<string, any>} 解析后的对象
 * @group Url
 * @example
 * ```ts
 * parseQueryString('?name=John&age=30&isDeveloper=true')
 * // 返回: { name: 'John', age: 30, isDeveloper: true }
 *
 * parseQueryString('https://example.com/page?tags=js&tags=ts')
 * // 返回: { tags: ['js', 'ts'] }
 *
 * parseQueryString('info=%7B%22city%22%3A%22Beijing%22%7D')
 * // 返回: { info: { city: 'Beijing' } }
 * ```
 */
export function parseQueryString(url: string, options: ParseQueryStringOptions = {}): Record<string, any> {
  if (!url)
    return {}

  const parseTypes = options.parseTypes !== false
  let search = url

  const queryIndex = search.indexOf('?')
  if (queryIndex !== -1) {
    search = search.slice(queryIndex + 1)
  }
  else {
    // 如果没有问号，且字符串看起来像是一个 URL/路径（包含协议或斜杠），或者完全不包含等号，说明没有查询参数
    if (search.includes('://') || search.includes('/') || !search.includes('=')) {
      return {}
    }
  }

  const hashIndex = search.indexOf('#')
  if (hashIndex !== -1) {
    search = search.slice(0, hashIndex)
  }

  if (!search)
    return {}

  const params = new URLSearchParams(search)
  const result: Record<string, any> = {}

  function parseValue(val: string): any {
    if (val === 'true')
      return true
    if (val === 'false')
      return false
    if (val === 'null')
      return null
    if (val === 'undefined')
      return undefined

    // 数字转换，需排除空字符串及带有前导 0 的数字字符串（如 "01"），保持与原字符串一致
    if (val !== '' && !Number.isNaN(Number(val)) && String(Number(val)) === val) {
      return Number(val)
    }

    // JSON 字符串转换
    if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
      try {
        return JSON.parse(val)
      }
      catch {
        // 忽略解析错误，返回原字符串
      }
    }

    return val
  }

  for (const [key, value] of params.entries()) {
    const parsedValue = parseTypes ? parseValue(value) : value
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      if (Array.isArray(result[key])) {
        result[key].push(parsedValue)
      }
      else {
        result[key] = [result[key], parsedValue]
      }
    }
    else {
      result[key] = parsedValue
    }
  }

  return result
}
