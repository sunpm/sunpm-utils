/**
 * 延迟指定的毫秒数
 *
 * @param {number} ms - 需要延迟的毫秒数
 * @returns {Promise<void>} 返回一个在指定时间后resolve的Promise
 * @group Promise
 * @example
 * ```ts
 * // 延迟2秒
 * await delay(2000)
 * console.log('2秒后执行')
 *
 * // 在异步函数中使用
 * async function fetchWithDelay() {
 *   await delay(1000)
 *   return fetch('/api/data')
 * }
 * ```
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 带超时控制的 Promise
 *
 * 如果 Promise 在指定时间内没有完成，则拒绝并抛出超时错误。
 *
 * @param {Promise<T>} promise - 要执行的 Promise
 * @param {number} ms - 超时时间（毫秒）
 * @param {string} [message] - 超时错误信息，默认为 "Operation timed out"
 * @returns {Promise<T>} 返回原 Promise 的结果，或在超时时抛出错误
 * @group Promise
 * @example
 * ```ts
 * // 正常完成
 * await timeout(fetch('/api/data'), 5000)
 *
 * // 超时
 * try {
 *   await timeout(delay(3000), 1000)
 * } catch (error) {
 *   console.error('超时了')
 * }
 *
 * // 自定义错误信息
 * await timeout(fetch('/api/data'), 5000, '请求超时')
 * ```
 */
export function timeout<T>(promise: Promise<T>, ms: number, message = 'Operation timed out'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms),
    ),
  ])
}

/**
 * 重试失败的 Promise
 *
 * 当 Promise 失败时，会自动重试指定次数，每次重试之间可以设置延迟时间。
 *
 * @param {() => Promise<T>} fn - 返回 Promise 的函数
 * @param {number} retries - 最大重试次数，默认为 3
 * @param {number} delayMs - 每次重试之间的延迟时间（毫秒），默认为 1000
 * @returns {Promise<T>} 返回成功的结果，或在所有重试失败后抛出最后一次的错误
 * @group Promise
 * @example
 * ```ts
 * // 重试失败的请求
 * const data = await retry(() => fetch('/api/data').then(r => r.json()), 3, 1000)
 *
 * // 自定义重试次数和延迟
 * await retry(
 *   () => riskyOperation(),
 *   5,  // 重试5次
 *   2000  // 每次间隔2秒
 * )
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn()
    }
    catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // 如果还有重试次数，则等待后继续
      if (i < retries) {
        await delay(delayMs)
      }
    }
  }

  // 所有重试都失败了，抛出最后一次的错误
  throw lastError
}

/**
 * 创建一个防抖函数（异步版本）
 *
 * 在指定的延迟时间内，如果函数被多次调用，只执行最后一次。
 * 返回一个 Promise，会在函数实际执行后 resolve。
 *
 * @param {(...args: T) => Promise<R> | R} fn - 要防抖的函数
 * @param {number} wait - 延迟时间（毫秒）
 * @returns 防抖后的函数
 * @group Promise
 * @example
 * ```ts
 * const searchAPI = debounce(async (query: string) => {
 *   const response = await fetch(`/api/search?q=${query}`)
 *   return response.json()
 * }, 300)
 *
 * // 只有最后一次调用会实际执行
 * searchAPI('a')
 * searchAPI('ab')
 * const result = await searchAPI('abc') // 只有这次会执行
 * ```
 */
export function debounce<T extends any[], R>(
  fn: (...args: T) => Promise<R> | R,
  wait: number,
): (...args: T) => Promise<R> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let pendingPromise: Promise<R> | undefined

  return (...args: T): Promise<R> => {
    // 清除之前的定时器
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }

    // 创建新的 Promise
    pendingPromise = new Promise<R>((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args)
          resolve(result)
        }
        catch (error) {
          reject(error)
        }
      }, wait)
    })

    return pendingPromise
  }
}

/**
 * 创建一个节流函数（异步版本）
 *
 * 在指定的时间间隔内，函数最多只执行一次。
 * 如果在等待期间有新的调用，会在等待结束后立即执行最新的调用。
 *
 * @param {(...args: T) => Promise<R> | R} fn - 要节流的函数
 * @param {number} wait - 时间间隔（毫秒）
 * @returns 节流后的函数
 * @group Promise
 * @example
 * ```ts
 * const saveData = throttle(async (data: any) => {
 *   await fetch('/api/save', {
 *     method: 'POST',
 *     body: JSON.stringify(data)
 *   })
 * }, 1000)
 *
 * // 1秒内多次调用，只执行一次
 * saveData({ value: 1 })
 * saveData({ value: 2 })
 * saveData({ value: 3 }) // 只有第一次和最后一次会执行
 * ```
 */
export function throttle<T extends any[], R>(
  fn: (...args: T) => Promise<R> | R,
  wait: number,
): (...args: T) => Promise<R> | undefined {
  let lastCallTime = 0
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastArgs: T | undefined

  return (...args: T): Promise<R> | undefined => {
    const now = Date.now()
    const timeSinceLastCall = now - lastCallTime

    lastArgs = args

    // 如果距离上次调用的时间超过了等待时间，立即执行
    if (timeSinceLastCall >= wait) {
      lastCallTime = now
      return Promise.resolve(fn(...args))
    }

    // 否则，设置一个定时器在等待时间结束后执行
    if (timeoutId === undefined) {
      return new Promise<R>((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          lastCallTime = Date.now()
          timeoutId = undefined
          try {
            if (lastArgs) {
              const result = await fn(...lastArgs)
              resolve(result)
            }
          }
          catch (error) {
            reject(error)
          }
        }, wait - timeSinceLastCall)
      })
    }

    return undefined
  }
}

/**
 * 并发执行多个 Promise，并限制同时执行的数量
 *
 * @param {(() => Promise<T>)[]} tasks - Promise 工厂函数数组
 * @param {number} limit - 最大并发数，默认为 5
 * @returns {Promise<T[]>} 返回所有 Promise 的结果数组
 * @group Promise
 * @example
 * ```ts
 * const urls = ['/api/1', '/api/2', '/api/3', '/api/4', '/api/5']
 * const tasks = urls.map(url => () => fetch(url).then(r => r.json()))
 *
 * // 最多同时执行 2 个请求
 * const results = await parallel(tasks, 2)
 * console.log(results)
 * ```
 */
export async function parallel<T>(
  tasks: (() => Promise<T>)[],
  limit = 5,
): Promise<T[]> {
  const results: T[] = Array.from({ length: tasks.length })
  let currentIndex = 0

  // 创建 worker 函数，每个 worker 会依次执行任务
  async function worker() {
    while (currentIndex < tasks.length) {
      const index = currentIndex++
      const task = tasks[index]
      if (task) {
        results[index] = await task()
      }
    }
  }

  // 创建指定数量的 worker 并发执行
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker())
  await Promise.all(workers)

  return results
}

/**
 * 顺序执行多个 Promise（一个接一个）
 *
 * @param {(() => Promise<T>)[]} tasks - Promise 工厂函数数组
 * @returns {Promise<T[]>} 返回所有 Promise 的结果数组
 * @group Promise
 * @example
 * ```ts
 * const tasks = [
 *   () => fetch('/api/1').then(r => r.json()),
 *   () => fetch('/api/2').then(r => r.json()),
 *   () => fetch('/api/3').then(r => r.json()),
 * ]
 *
 * // 按顺序执行，每个完成后才执行下一个
 * const results = await sequential(tasks)
 * console.log(results)
 * ```
 */
export async function sequential<T>(
  tasks: (() => Promise<T>)[],
): Promise<T[]> {
  const results: T[] = []

  for (const task of tasks) {
    const result = await task()
    results.push(result)
  }

  return results
}
