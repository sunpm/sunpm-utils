/**
 * 数组操作相关的工具函数
 */

/**
 * 从数组中移除指定的项
 * @param array 原始数组
 * @param item 要移除的项
 * @returns 移除指定项后的新数组
 */
export function remove<T>(array: T[], item: T): T[] {
  return array.filter(i => i !== item)
}

/**
 * 数组去重
 * @param array 原始数组
 * @returns 去重后的新数组
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

/**
 * 将数组分成指定大小的块
 * @param array 原始数组
 * @param size 每个块的大小
 * @returns 二维数组，每个子数组最多包含 size 个元素
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0)
    return [array]

  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }

  return result
}

/**
 * 获取数组中的最后一个元素
 * @param array 数组
 * @returns 最后一个元素，如果数组为空则返回 undefined
 */
export function last<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[array.length - 1] : undefined
}

/**
 * 获取数组中的第一个元素
 * @param array 数组
 * @returns 第一个元素，如果数组为空则返回 undefined
 */
export function first<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined
}

/**
 * 随机打乱数组
 * @param array 原始数组
 * @returns 打乱后的新数组
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T]
  }

  return result
}

/**
 * 从数组中随机选择一个元素
 * @param array 数组
 * @returns 随机选择的元素，如果数组为空则返回 undefined
 */
export function sample<T>(array: T[]): T | undefined {
  if (array.length === 0)
    return undefined
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

/**
 * 比较两个数组是否相等
 * @param a 第一个数组
 * @param b 第二个数组
 * @returns 是否相等
 */
export function isEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length)
    return false
  return a.every((item, index) => item === b[index])
}

/**
 * 根据条件对数组中的元素进行分组
 * @param array 原始数组
 * @param keyFn 用于生成分组键的函数
 * @returns 分组后的对象，键为分组键，值为对应的元素数组
 */
export function groupBy<T, K extends string | number | symbol>(array: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    (result[key] = result[key] || []).push(item)
    return result
  }, {} as Record<K, T[]>)
}
