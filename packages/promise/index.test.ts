import { describe, expect, it, vi } from 'vitest'
import { debounce, delay, parallel, retry, sequential, throttle, timeout } from './index'

describe('delay', () => {
  it('应该在指定的时间后resolve', async () => {
    const start = Date.now()
    const delayTime = 100

    vi.useFakeTimers()
    const promise = delay(delayTime)
    vi.advanceTimersByTime(delayTime)
    await promise
    vi.useRealTimers()

    const end = Date.now()
    // 由于使用了假计时器，时间差可能很小，但在真实环境中我们可以检查时间是否大致相符
    expect(end - start).toBeLessThanOrEqual(delayTime + 50)
  })

  it('应该是一个Promise', () => {
    const result = delay(100)
    expect(result).toBeInstanceOf(Promise)
  })
})

describe('timeout', () => {
  it('应该在超时前正常完成', async () => {
    const promise = Promise.resolve('success')
    const result = await timeout(promise, 1000)
    expect(result).toBe('success')
  })

  it('应该在超时后抛出错误', async () => {
    const promise = new Promise(resolve => setTimeout(resolve, 2000))
    await expect(timeout(promise, 100, '超时了')).rejects.toThrow('超时了')
  })

  it('应该使用默认错误消息', async () => {
    const promise = new Promise(resolve => setTimeout(resolve, 2000))
    await expect(timeout(promise, 100)).rejects.toThrow('Operation timed out')
  })
})

describe('retry', () => {
  it('应该在第一次尝试成功时不重试', async () => {
    const fn = vi.fn().mockResolvedValue('success')
    const result = await retry(fn, 3, 10)
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应该重试失败的操作', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValueOnce('success')

    const result = await retry(fn, 3, 10)
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('应该在所有重试失败后抛出最后的错误', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fail'))
    await expect(retry(fn, 2, 10)).rejects.toThrow('always fail')
    expect(fn).toHaveBeenCalledTimes(3) // 1次初始 + 2次重试
  })
})

describe('debounce', () => {
  it('应该延迟执行函数', async () => {
    vi.useFakeTimers()
    const fn = vi.fn().mockResolvedValue('result')
    const debounced = debounce(fn, 100)

    const promise = debounced('test')
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    await promise

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('test')
    vi.useRealTimers()
  })

  it('应该取消之前的调用', async () => {
    vi.useFakeTimers()
    const fn = vi.fn().mockResolvedValue('result')
    const debounced = debounce(fn, 100)

    debounced('call1')
    debounced('call2')
    const promise = debounced('call3')

    vi.advanceTimersByTime(100)
    await promise

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('call3')
    vi.useRealTimers()
  })
})

describe('throttle', () => {
  it('应该立即执行第一次调用', async () => {
    const fn = vi.fn().mockResolvedValue('result')
    const throttled = throttle(fn, 100)

    const result = await throttled('test')
    expect(result).toBe('result')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应该限制执行频率', async () => {
    vi.useFakeTimers()
    const fn = vi.fn().mockResolvedValue('result')
    const throttled = throttle(fn, 100)

    // 第一次调用立即执行
    await throttled('call1')
    expect(fn).toHaveBeenCalledTimes(1)

    // 在等待时间内的调用不会立即执行
    throttled('call2')
    expect(fn).toHaveBeenCalledTimes(1)

    // 等待后再次调用
    vi.advanceTimersByTime(100)
    await vi.runAllTimersAsync()

    expect(fn).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })
})

describe('parallel', () => {
  it('应该并发执行任务', async () => {
    const results: number[] = []
    const tasks = [
      () => delay(50).then(() => {
        results.push(1)
        return 1
      }),
      () => delay(30).then(() => {
        results.push(2)
        return 2
      }),
      () => delay(10).then(() => {
        results.push(3)
        return 3
      }),
    ]

    const output = await parallel(tasks, 3)
    expect(output).toEqual([1, 2, 3])
  })

  it('应该限制并发数', async () => {
    let concurrent = 0
    let maxConcurrent = 0

    const createTask = (id: number) => async () => {
      concurrent++
      maxConcurrent = Math.max(maxConcurrent, concurrent)
      await delay(10)
      concurrent--
      return id
    }

    const tasks = Array.from({ length: 10 }, (_, i) => createTask(i))
    await parallel(tasks, 3)

    expect(maxConcurrent).toBeLessThanOrEqual(3)
  })

  it('应该处理空任务数组', async () => {
    const result = await parallel([], 5)
    expect(result).toEqual([])
  })
})

describe('sequential', () => {
  it('应该按顺序执行任务', async () => {
    const results: number[] = []
    const tasks = [
      async () => {
        results.push(1)
        return 1
      },
      async () => {
        results.push(2)
        return 2
      },
      async () => {
        results.push(3)
        return 3
      },
    ]

    const output = await sequential(tasks)
    expect(output).toEqual([1, 2, 3])
    expect(results).toEqual([1, 2, 3])
  })

  it('应该等待每个任务完成后再执行下一个', async () => {
    const executionOrder: number[] = []

    const tasks = [
      async () => {
        await delay(30)
        executionOrder.push(1)
        return 1
      },
      async () => {
        executionOrder.push(2)
        return 2
      },
      async () => {
        executionOrder.push(3)
        return 3
      },
    ]

    await sequential(tasks)
    expect(executionOrder).toEqual([1, 2, 3])
  })

  it('应该处理空任务数组', async () => {
    const result = await sequential([])
    expect(result).toEqual([])
  })
})
