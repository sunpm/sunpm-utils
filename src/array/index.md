# 数组工具函数

这个模块提供了一系列处理数组的实用工具函数，设计为简洁高效，易于使用。

## 安装

```bash
# npm
npm install sunpm-utils

# yarn
yarn add sunpm-utils

# pnpm
pnpm add sunpm-utils
```

## 使用方法

```js
// 导入所有数组工具函数
import { remove, unique, chunk, last, first } from 'sunpm-utils/array'

// 或者使用命名导入特定函数
import { chunk } from 'sunpm-utils/array'
```

## API 参考

### remove

从数组中移除指定的项，并返回一个新数组。

```js
/**
 * 从数组中移除指定的项
 * @param array 原始数组
 * @param item 要移除的项
 * @returns 移除指定项后的新数组
 */
function remove<T>(array: T[], item: T): T[]
```

示例：

```js
import { remove } from 'sunpm-utils/array'

const numbers = [1, 2, 3, 4, 5]
const newArray = remove(numbers, 3)
console.log(newArray) // [1, 2, 4, 5]
```

### unique

移除数组中的重复项，并返回一个新数组。

```js
/**
 * 数组去重
 * @param array 原始数组
 * @returns 去重后的新数组
 */
function unique<T>(array: T[]): T[]
```

示例：

```js
import { unique } from 'sunpm-utils/array'

const numbers = [1, 2, 2, 3, 3, 4, 5, 5]
const uniqueArray = unique(numbers)
console.log(uniqueArray) // [1, 2, 3, 4, 5]
```

### chunk

将数组分成指定大小的块，并返回一个二维数组。

```js
/**
 * 将数组分成指定大小的块
 * @param array 原始数组
 * @param size 每个块的大小
 * @returns 二维数组，每个子数组最多包含 size 个元素
 */
function chunk<T>(array: T[], size: number): T[][]
```

示例：

```js
import { chunk } from 'sunpm-utils/array'

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const chunks = chunk(numbers, 3)
console.log(chunks) // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
```

### last

获取数组中的最后一个元素。

```js
/**
 * 获取数组中的最后一个元素
 * @param array 数组
 * @returns 最后一个元素，如果数组为空则返回 undefined
 */
function last<T>(array: T[]): T | undefined
```

示例：

```js
import { last } from 'sunpm-utils/array'

const numbers = [1, 2, 3, 4, 5]
const lastNumber = last(numbers)
console.log(lastNumber) // 5
```

### first

获取数组中的第一个元素。

```js
/**
 * 获取数组中的第一个元素
 * @param array 数组
 * @returns 第一个元素，如果数组为空则返回 undefined
 */
function first<T>(array: T[]): T | undefined
```

示例：

```js
import { first } from 'sunpm-utils/array'

const numbers = [1, 2, 3, 4, 5]
const firstNumber = first(numbers)
console.log(firstNumber) // 1
```

### shuffle

随机打乱数组元素顺序，并返回一个新数组。

```js
/**
 * 随机打乱数组
 * @param array 原始数组
 * @returns 打乱后的新数组
 */
function shuffle<T>(array: T[]): T[]
```

示例：

```js
import { shuffle } from 'sunpm-utils/array'

const numbers = [1, 2, 3, 4, 5]
const shuffled = shuffle(numbers)
console.log(shuffled) // 随机顺序，例如: [3, 1, 5, 2, 4]
```

### sample

从数组中随机选择一个元素。

```js
/**
 * 从数组中随机选择一个元素
 * @param array 数组
 * @returns 随机选择的元素，如果数组为空则返回 undefined
 */
function sample<T>(array: T[]): T | undefined
```

示例：

```js
import { sample } from 'sunpm-utils/array'

const fruits = ['苹果', '香蕉', '橙子', '梨', '葡萄']
const randomFruit = sample(fruits)
console.log(randomFruit) // 随机返回一种水果
```

### isEqual

比较两个数组是否相等（元素顺序和值都相同）。

```js
/**
 * 比较两个数组是否相等
 * @param a 第一个数组
 * @param b 第二个数组
 * @returns 是否相等
 */
function isEqual<T>(a: T[], b: T[]): boolean
```

示例：

```js
import { isEqual } from 'sunpm-utils/array'

console.log(isEqual([1, 2, 3], [1, 2, 3])) // true
console.log(isEqual([1, 2, 3], [3, 2, 1])) // false
```

### groupBy

根据条件对数组中的元素进行分组。

```js
/**
 * 根据条件对数组中的元素进行分组
 * @param array 原始数组
 * @param keyFn 用于生成分组键的函数
 * @returns 分组后的对象，键为分组键，值为对应的元素数组
 */
function groupBy<T, K extends string | number | symbol>(array: T[], keyFn: (item: T) => K): Record<K, T[]>
```

示例：

```js
import { groupBy } from 'sunpm-utils/array'

const numbers = [1, 2, 3, 4, 5, 6]
const grouped = groupBy(numbers, n => n % 2 === 0 ? 'even' : 'odd')
console.log(grouped)
// 输出:
// {
//   even: [2, 4, 6],
//   odd: [1, 3, 5]
// }
```

## 注意事项

- 所有函数都不会修改原始数组，而是返回一个新的数组或值。
- 函数设计为类型安全，支持泛型。
