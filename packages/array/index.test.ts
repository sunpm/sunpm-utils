import { describe, expect, it } from 'vitest'
import {
  appendUniversalOption,
  arrayToObject,
  chunk,
  first,
  groupBy,
  isEqual,
  last,
  remove,
  sample,
  shuffle,
  unique,
} from './index'

describe('remove', () => {
  it('应该从数组中移除指定的项', () => {
    const array = [1, 2, 3, 4, 5]
    expect(remove(array, 3)).toEqual([1, 2, 4, 5])
  })

  it('应该返回新数组，不修改原数组', () => {
    const array = [1, 2, 3, 4, 5]
    const result = remove(array, 3)
    expect(array).toEqual([1, 2, 3, 4, 5]) // 原数组不变
    expect(result).not.toBe(array) // 返回新数组
  })

  it('尝试移除不存在的项时应该返回原数组的副本', () => {
    const array = [1, 2, 3, 4, 5]
    expect(remove(array, 6)).toEqual([1, 2, 3, 4, 5])
  })
})

describe('unique', () => {
  it('应该移除重复项', () => {
    const array = [1, 2, 2, 3, 4, 4, 5]
    expect(unique(array)).toEqual([1, 2, 3, 4, 5])
  })

  it('应该处理空数组', () => {
    expect(unique([])).toEqual([])
  })

  it('应该处理没有重复项的数组', () => {
    const array = [1, 2, 3, 4, 5]
    expect(unique(array)).toEqual([1, 2, 3, 4, 5])
  })
})

describe('chunk', () => {
  it('应该将数组分成指定大小的块', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    expect(chunk(array, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]])
  })

  it('当chunk大小大于或等于数组长度时，应返回单个块', () => {
    const array = [1, 2, 3, 4, 5]
    expect(chunk(array, 5)).toEqual([[1, 2, 3, 4, 5]])
    expect(chunk(array, 10)).toEqual([[1, 2, 3, 4, 5]])
  })

  it('当chunk大小小于等于0时，应返回包含原数组的单个块', () => {
    const array = [1, 2, 3, 4, 5]
    expect(chunk(array, 0)).toEqual([[1, 2, 3, 4, 5]])
    expect(chunk(array, -1)).toEqual([[1, 2, 3, 4, 5]])
  })
})

describe('last', () => {
  it('应该返回数组的最后一个元素', () => {
    const array = [1, 2, 3, 4, 5]
    expect(last(array)).toBe(5)
  })

  it('当数组为空时应该返回undefined', () => {
    expect(last([])).toBeUndefined()
  })
})

describe('first', () => {
  it('应该返回数组的第一个元素', () => {
    const array = [1, 2, 3, 4, 5]
    expect(first(array)).toBe(1)
  })

  it('当数组为空时应该返回undefined', () => {
    expect(first([])).toBeUndefined()
  })
})

describe('shuffle', () => {
  it('应该返回打乱的新数组', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const shuffled = shuffle(array)

    // 长度应保持不变
    expect(shuffled.length).toBe(array.length)

    // 元素应完全相同（忽略顺序）
    expect(shuffled.sort()).toEqual(array.sort())

    // 打乱后的数组应该与原数组不同（注意：这个测试有小概率会失败）
    // 使用大量元素降低失败概率
    const largeArray = Array.from({ length: 50 }, (_, i) => i)
    const shuffledLarge = shuffle(largeArray)
    expect(shuffledLarge).not.toEqual(largeArray)
  })
})

describe('sample', () => {
  it('应该从数组中随机选择一个元素', () => {
    const array = [1, 2, 3, 4, 5]
    const result = sample(array)
    expect(array).toContain(result)
  })

  it('当数组为空时应该返回undefined', () => {
    expect(sample([])).toBeUndefined()
  })
})

describe('isEqual', () => {
  it('应该正确比较两个相等的数组', () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true)
  })

  it('应该正确比较两个不相等的数组', () => {
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false)
    expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false)
  })

  it('应该正确处理长度不同的数组', () => {
    expect(isEqual([1, 2, 3], [1, 2])).toBe(false)
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false)
  })
})

describe('groupBy', () => {
  it('应该根据提供的函数对数组元素进行分组', () => {
    const array = [1, 2, 3, 4, 5, 6]
    const result = groupBy(array, item => item % 2 === 0 ? 'even' : 'odd')
    expect(result).toEqual({
      even: [2, 4, 6],
      odd: [1, 3, 5],
    })
  })

  it('应该处理空数组', () => {
    expect(groupBy([], item => item)).toEqual({})
  })
})

describe('appendUniversalOption', () => {
  it('应该在数组前添加默认的全部选项', () => {
    const options = [
      { label: '选项1', value: 1 },
      { label: '选项2', value: 2 },
    ]

    const result = appendUniversalOption(options)

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ label: '全部', value: '' })
    expect(result[1]).toBe(options[0])
    expect(result[2]).toBe(options[1])
  })

  it('应该使用自定义的字段名和值', () => {
    const options = [
      { text: '选项1', id: 1 },
      { text: '选项2', id: 2 },
    ]

    const result = appendUniversalOption(options, {
      name: 'text',
      valueKey: 'id',
      value: 0,
    })

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ text: '全部', id: 0 })
    expect(result[1]).toBe(options[0])
    expect(result[2]).toBe(options[1])
  })

  it('应该处理空数组', () => {
    const options: Array<Record<string, any>> = []

    const result = appendUniversalOption(options)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ label: '全部', value: '' })
  })
})
describe('arrayToObject', () => {
  it('应该根据传入数组返回对象', () => {
    const arr = [
      { key: 'tom', name: '汤姆' },
      { key: 'jack', name: '杰克' },
    ]
    expect(arrayToObject(arr, 'key')).toEqual(
      {
        tom: { key: 'tom', name: '汤姆' },
        jack: { key: 'jack', name: '杰克' },
      },
    )
  })
  it('如果 key 的值是空，应该跳过这个 key', () => {
    const arr = [
      {
        key: 'tom',
        name: '汤姆',
      },
      {
        key: '',
        name: '杰克',
      },
    ]
    expect(arrayToObject(arr, 'key')).toEqual({
      tom: {
        key: 'tom',
        name: '汤姆',
      },
    })
  })
})
