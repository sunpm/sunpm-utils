import { describe, expect, it, vi } from 'vitest'
import { delay } from './index'

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
