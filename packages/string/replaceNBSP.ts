/**
 * 替换表格数据中指定字段的 &nbsp; 为不换行空格
 *
 * @param {Array<Record<string, any>>} tableData - 表格数据数组或Vue ref
 * @param {string} key - 需要处理的字段名
 * @returns {Array<Record<string, any>>} 处理后的表格数据数组
 *
 * @example
 * ```ts
 * // 基本用法
 * const data = [
 *   { name: 'John&nbsp;Doe', age: 30 },
 *   { name: 'Jane&nbsp;&nbsp;Smith', age: 25 }
 * ]
 * const result = replaceNBSP(data, 'name')
 * // 结果: [
 * //   { name: 'John  Doe', age: 30 },
 * //   { name: 'Jane    Smith', age: 25 }
 * // ]
 *
 * // 使用ref包装的数据 (在Vue中使用)
 * const refData = ref([
 *   { desc: 'Product&nbsp;Info', price: 99 },
 *   { desc: 'Service&nbsp;&nbsp;Details', price: 50 }
 * ])
 * const result = replaceNBSP(refData, 'desc')
 * // 结果: [
 * //   { desc: 'Product  Info', price: 99 },
 * //   { desc: 'Service    Details', price: 50 }
 * // ]
 *
 * // 空数组情况
 * const emptyData = []
 * const result = replaceNBSP(emptyData, 'name')
 * // 结果: []
 * ```
 */
export function replaceNBSP<T extends Record<string, string | number | boolean | object>>(
  tableData: T[] | { value: T[] },
  key: string,
): T[] {
  // 如果是 ref 对象，获取其 value
  const unwrappedData = Array.isArray(tableData) ? tableData : tableData.value

  if (unwrappedData.length) {
    return unwrappedData.map((item) => {
      if (typeof item[key] === 'string') {
        // 创建一个新对象，不修改原对象
        return {
          ...item,
          [key]: (item[key] as string).replace(/&nbsp;/g, '\u00A0\u00A0'),
        }
      }
      return item
    })
  }

  return []
}
