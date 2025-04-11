import { describe, expect, it } from 'vitest'
import { replaceNBSP } from './replaceNBSP'

describe('replaceNBSP', () => {
  it('应该替换字符串中的&nbsp;为不换行空格', () => {
    const data = [
      { name: 'John&nbsp;Doe', age: 30 },
      { name: 'Jane&nbsp;&nbsp;Smith', age: 25 },
    ]

    const result = replaceNBSP(data, 'name')

    expect((result[0] as any).name).toBe('John\u00A0\u00A0Doe')
    expect((result[1] as any).name).toBe('Jane\u00A0\u00A0\u00A0\u00A0Smith')
    // 原始数据应该保持不变
    expect((data[0] as any).name).toBe('John&nbsp;Doe')
  })

  it('应该处理Vue ref包装的数据', () => {
    const refData = {
      value: [
        { desc: 'Product&nbsp;Info', price: 99 },
        { desc: 'Service&nbsp;&nbsp;Details', price: 50 },
      ],
    }

    const result = replaceNBSP(refData, 'desc')

    expect((result[0] as any).desc).toBe('Product\u00A0\u00A0Info')
    expect((result[1] as any).desc).toBe('Service\u00A0\u00A0\u00A0\u00A0Details')
    // 原始数据应该保持不变
    expect((refData.value[0] as any).desc).toBe('Product&nbsp;Info')
  })

  it('应该忽略非字符串字段', () => {
    const data = [
      { name: 'John', count: 10 },
      { name: 'Jane', count: 20 },
    ]

    const result = replaceNBSP(data, 'count')

    // 因为count是数字，所以不应该被修改
    expect(result).toEqual(data)
    // 但结果应该是一个新的数组
    expect(result).not.toBe(data)
  })

  it('应该在空数组情况下返回空数组', () => {
    const emptyData: Array<Record<string, any>> = []

    const result = replaceNBSP(emptyData, 'name')

    expect(result).toEqual([])
  })
})
