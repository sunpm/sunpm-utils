/**
 * @module 数组操作
 * @description 提供各种数组处理函数，包括数组转换、查询、过滤等实用功能。这些函数都不会修改原始数组，而是返回新的数组或值。
 */

/**
 * 从数组中移除指定的项
 * @param array 原始数组
 * @param item 要移除的项
 * @returns 移除指定项后的新数组，不会修改原始数组
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5]
 * const newArray = remove(numbers, 3) // [1, 2, 4, 5]
 * console.log(numbers) // 原数组不变: [1, 2, 3, 4, 5]
 *
 * // 移除字符串
 * const fruits = ['苹果', '香蕉', '橙子']
 * const newFruits = remove(fruits, '香蕉') // ['苹果', '橙子']
 * ```
 */
export function remove<T>(array: T[], item: T): T[] {
  return array.filter(i => i !== item)
}

/**
 * 数组去重，移除数组中的重复元素
 * @param array 原始数组
 * @returns 去重后的新数组，保持原始顺序
 * @example
 * ```ts
 * const numbers = [1, 2, 2, 3, 3, 4, 5, 5]
 * const uniqueArray = unique(numbers) // [1, 2, 3, 4, 5]
 *
 * // 对象数组会基于引用去重，内容相同但引用不同的对象会被视为不同元素
 * const objArray = [{id: 1}, {id: 2}, {id: 1}]
 * const uniqueObjArray = unique(objArray) // [{id: 1}, {id: 2}, {id: 1}]
 * ```
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

/**
 * 将数组分成指定大小的块
 * @param array 原始数组
 * @param size 每个块的大小，必须为正整数
 * @returns 二维数组，每个子数组最多包含 size 个元素
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * const chunks = chunk(numbers, 3)
 * // 结果: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
 *
 * // 如果 size 小于等于 0，则返回包含原始数组的数组
 * chunk(numbers, 0) // [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
 * ```
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
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5]
 * const lastNumber = last(numbers) // 5
 *
 * const empty = []
 * const lastEmpty = last(empty) // undefined
 * ```
 */
export function last<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[array.length - 1] : undefined
}

/**
 * 获取数组中的第一个元素
 * @param array 数组
 * @returns 第一个元素，如果数组为空则返回 undefined
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5]
 * const firstNumber = first(numbers) // 1
 *
 * const empty = []
 * const firstEmpty = first(empty) // undefined
 * ```
 */
export function first<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined
}

/**
 * 随机打乱数组元素顺序
 * @param array 原始数组
 * @returns 打乱后的新数组，不会修改原始数组
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5]
 * const shuffled = shuffle(numbers)
 * // 可能的结果: [3, 1, 5, 2, 4]
 * console.log(numbers) // 原数组不变: [1, 2, 3, 4, 5]
 * ```
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
 * @example
 * ```ts
 * const fruits = ['苹果', '香蕉', '橙子', '梨', '葡萄']
 * const randomFruit = sample(fruits)
 * // 可能返回: '香蕉'
 *
 * const empty = []
 * const emptyResult = sample(empty) // undefined
 * ```
 */
export function sample<T>(array: T[]): T | undefined {
  if (array.length === 0)
    return undefined
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

/**
 * 比较两个数组是否相等（元素顺序和值都相同）
 * @param a 第一个数组
 * @param b 第二个数组
 * @returns 如果两个数组长度相同且对应位置的元素全部相等则返回 true，否则返回 false
 * @example
 * ```ts
 * isEqual([1, 2, 3], [1, 2, 3]) // true
 * isEqual([1, 2, 3], [1, 3, 2]) // false，顺序不同
 * isEqual([1, 2, 3], [1, 2]) // false，长度不同
 *
 * // 对象比较是基于引用的
 * const obj = { id: 1 }
 * isEqual([obj], [obj]) // true，同一个对象引用
 * isEqual([{ id: 1 }], [{ id: 1 }]) // false，不同对象引用
 * ```
 */
export function isEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length)
    return false
  return a.every((item, index) => item === b[index])
}

/**
 * 根据条件对数组中的元素进行分组
 * @param array 原始数组
 * @param keyFn 用于生成分组键的函数，接收数组元素并返回用作分组键的值
 * @returns 分组后的对象，键为分组键，值为对应的元素数组
 * @example
 * ```ts
 * const people = [
 *   { name: '张三', age: 25 },
 *   { name: '李四', age: 30 },
 *   { name: '王五', age: 25 },
 *   { name: '赵六', age: 30 }
 * ]
 *
 * // 按年龄分组
 * const groupedByAge = groupBy(people, person => person.age)
 * // 结果:
 * // {
 * //   25: [{ name: '张三', age: 25 }, { name: '王五', age: 25 }],
 * //   30: [{ name: '李四', age: 30 }, { name: '赵六', age: 30 }]
 * // }
 *
 * // 使用字符串键
 * const groupedByAgeRange = groupBy(people, person =>
 *   person.age < 30 ? '青年' : '成年')
 * // 结果:
 * // {
 * //   '青年': [{ name: '张三', age: 25 }, { name: '王五', age: 25 }],
 * //   '成年': [{ name: '李四', age: 30 }, { name: '赵六', age: 30 }]
 * // }
 * ```
 */
export function groupBy<T, K extends string | number | symbol>(array: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    (result[key] = result[key] || []).push(item)
    return result
  }, {} as Record<K, T[]>)
}
