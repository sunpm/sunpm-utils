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
