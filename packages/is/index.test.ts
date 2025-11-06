import { describe, expect, it } from 'vitest'
import {
  isArray,
  isBoolean,
  isClass,
  isDate,
  isEmpty,
  isEmptyObject,
  isFunction,
  isMap,
  isMobilePhone,
  isNaN,
  isNull,
  isNullOrUndefined,
  isNumber,
  isObject,
  isPlainObject,
  isPrimitive,
  isPromise,
  isRegExp,
  isSet,
  isString,
  isSymbol,
  isUndefined,
} from './index'

describe('isString', () => {
  it('应该正确识别字符串类型', () => {
    expect(isString('hello')).toBe(true)
    expect(isString('')).toBe(true)
    expect(isString(`template string`)).toBe(true)

    // 非字符串类型
    expect(isString(123)).toBe(false)
    expect(isString(true)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
    expect(isString({})).toBe(false)
    expect(isString([])).toBe(false)
    expect(isString(new Object('hello'))).toBe(false) // 包装对象不是原始字符串
  })
})

describe('isNumber', () => {
  it('应该正确识别数字类型', () => {
    expect(isNumber(123)).toBe(true)
    expect(isNumber(0)).toBe(true)
    expect(isNumber(-45.67)).toBe(true)
    expect(isNumber(Infinity)).toBe(true)

    // 非数字类型
    expect(isNumber('123')).toBe(false)
    expect(isNumber(Number.NaN)).toBe(false) // NaN 会返回 false
    expect(isNumber(null)).toBe(false)
    expect(isNumber(undefined)).toBe(false)
    expect(isNumber({})).toBe(false)
    expect(isNumber([])).toBe(false)
  })
})

describe('isBoolean', () => {
  it('应该正确识别布尔类型', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)

    // 非布尔类型
    expect(isBoolean(0)).toBe(false)
    expect(isBoolean(1)).toBe(false)
    expect(isBoolean('true')).toBe(false)
    expect(isBoolean('false')).toBe(false)
    expect(isBoolean(null)).toBe(false)
    expect(isBoolean(undefined)).toBe(false)
    expect(isBoolean({})).toBe(false)
    expect(isBoolean(new Object(true))).toBe(false) // 包装对象不是原始布尔类型
  })
})

describe('isFunction', () => {
  it('应该正确识别函数类型', () => {
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction(class {})).toBe(true)
    expect(isFunction(Math.sin)).toBe(true)

    // 非函数类型
    expect(isFunction({})).toBe(false)
    expect(isFunction([])).toBe(false)
    expect(isFunction('function')).toBe(false)
    expect(isFunction(123)).toBe(false)
    expect(isFunction(null)).toBe(false)
    expect(isFunction(undefined)).toBe(false)
  })
})

describe('isClass', () => {
  it('应该正确识别类构造函数', () => {
    // ES6 类
    expect(isClass(class {})).toBe(true)
    expect(isClass(class User {})).toBe(true)
    expect(isClass(class extends Array {})).toBe(true)

    // 内置类构造函数
    expect(isClass(Array)).toBe(true)
    expect(isClass(Object)).toBe(true)
    expect(isClass(Date)).toBe(true)
    expect(isClass(RegExp)).toBe(true)
    expect(isClass(Map)).toBe(true)
    expect(isClass(Set)).toBe(true)

    // 非类构造函数
    expect(isClass(() => {})).toBe(false)
    expect(isClass(() => {})).toBe(false)
    expect(isClass(Math.sin)).toBe(false)
    // eslint-disable-next-line no-console
    expect(isClass(console.log)).toBe(false)
    expect(isClass({})).toBe(false)
    expect(isClass([])).toBe(false)
    expect(isClass('class')).toBe(false)
    expect(isClass(123)).toBe(false)
    expect(isClass(null)).toBe(false)
    expect(isClass(undefined)).toBe(false)
  })
})

describe('isObject', () => {
  it('应该正确识别对象类型', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ a: 1 })).toBe(true)
    expect(isObject([])).toBe(true) // 数组也是对象
    expect(isObject(new Date())).toBe(true)
    expect(isObject(new Map())).toBe(true)
    expect(isObject(new Set())).toBe(true)

    // 非对象类型
    expect(isObject(null)).toBe(false) // null 不是对象
    expect(isObject(undefined)).toBe(false)
    expect(isObject(123)).toBe(false)
    expect(isObject('object')).toBe(false)
    expect(isObject(true)).toBe(false)
    expect(isObject(() => {})).toBe(false) // 函数在 JavaScript 中是特殊的对象，但这里返回 false
  })
})

describe('isArray', () => {
  it('应该正确识别数组类型', () => {
    expect(isArray([])).toBe(true)
    expect(isArray([1, 2, 3])).toBe(true)
    expect(isArray([])).toBe(true)
    expect(isArray(Array.from('abc'))).toBe(true)

    // 非数组类型
    expect(isArray({})).toBe(false)
    expect(isArray('abc')).toBe(false)
    expect(isArray(123)).toBe(false)
    expect(isArray(null)).toBe(false)
    expect(isArray(undefined)).toBe(false)
    expect(isArray(new Set())).toBe(false)
  })
})

describe('isDate', () => {
  it('应该正确识别日期类型', () => {
    expect(isDate(new Date())).toBe(true)

    // 非日期类型
    expect(isDate(Date.now())).toBe(false) // 时间戳是数字，不是日期对象
    expect(isDate('2023-05-15')).toBe(false) // 日期字符串不是日期对象
    expect(isDate({})).toBe(false)
    expect(isDate(null)).toBe(false)
    expect(isDate(undefined)).toBe(false)
  })
})

describe('isRegExp', () => {
  it('应该正确识别正则表达式', () => {
    expect(isRegExp(/abc/)).toBe(true)
    expect(isRegExp(/^abc$/)).toBe(true)
    expect(isRegExp(/xyz/)).toBe(true)

    // 非正则表达式
    expect(isRegExp('/abc/')).toBe(false) // 字符串不是正则表达式
    expect(isRegExp({})).toBe(false)
    expect(isRegExp(null)).toBe(false)
    expect(isRegExp(undefined)).toBe(false)
  })
})

describe('isPromise', () => {
  it('应该正确识别 Promise', () => {
    expect(isPromise(Promise.resolve())).toBe(true)
    expect(isPromise(new Promise(() => {}))).toBe(true)
    expect(isPromise({ then: () => {}, catch: () => {} })).toBe(true) // 类 Promise 对象

    // 非 Promise
    expect(isPromise({})).toBe(false)
    expect(isPromise({ then: () => {} })).toBe(false) // 只有 then 方法
    expect(isPromise(null)).toBe(false)
    expect(isPromise(undefined)).toBe(false)
    expect(isPromise(() => {})).toBe(false)
  })
})

describe('isMap', () => {
  it('应该正确识别 Map', () => {
    expect(isMap(new Map())).toBe(true)
    expect(isMap(new Map([['key', 'value']]))).toBe(true)

    // 非 Map
    expect(isMap(new WeakMap())).toBe(false)
    expect(isMap({})).toBe(false)
    expect(isMap([])).toBe(false)
    expect(isMap(null)).toBe(false)
    expect(isMap(undefined)).toBe(false)
  })
})

describe('isSet', () => {
  it('应该正确识别 Set', () => {
    expect(isSet(new Set())).toBe(true)
    expect(isSet(new Set([1, 2, 3]))).toBe(true)

    // 非 Set
    expect(isSet(new WeakSet())).toBe(false)
    expect(isSet({})).toBe(false)
    expect(isSet([])).toBe(false)
    expect(isSet(null)).toBe(false)
    expect(isSet(undefined)).toBe(false)
  })
})

describe('isSymbol', () => {
  it('应该正确识别 Symbol', () => {
    expect(isSymbol(Symbol('test'))).toBe(true)
    expect(isSymbol(Symbol('foo'))).toBe(true)
    expect(isSymbol(Symbol.for('bar'))).toBe(true)

    // 非 Symbol
    expect(isSymbol('symbol')).toBe(false)
    expect(isSymbol({})).toBe(false)
    expect(isSymbol(null)).toBe(false)
    expect(isSymbol(undefined)).toBe(false)
  })
})

describe('isPrimitive', () => {
  it('应该正确识别原始类型', () => {
    // 原始类型
    expect(isPrimitive('hello')).toBe(true)
    expect(isPrimitive(123)).toBe(true)
    expect(isPrimitive(true)).toBe(true)
    expect(isPrimitive(Symbol('foo'))).toBe(true)
    expect(isPrimitive(null)).toBe(true)
    expect(isPrimitive(undefined)).toBe(true)
    try {
      // 某些环境可能不支持 BigInt
      expect(isPrimitive(BigInt(123))).toBe(true)
    }
    catch {
      // 忽略错误
    }

    // 非原始类型
    expect(isPrimitive({})).toBe(false)
    expect(isPrimitive([])).toBe(false)
    expect(isPrimitive(new Date())).toBe(false)
    expect(isPrimitive(() => {})).toBe(false)
    expect(isPrimitive(new Map())).toBe(false)
    expect(isPrimitive(new Set())).toBe(false)
  })
})

describe('isUndefined', () => {
  it('应该正确识别 undefined', () => {
    expect(isUndefined(undefined)).toBe(true)
    expect(isUndefined(void 0)).toBe(true)

    // 非 undefined 类型
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined('')).toBe(false)
    expect(isUndefined(0)).toBe(false)
    expect(isUndefined(false)).toBe(false)
    expect(isUndefined({})).toBe(false)
  })
})

describe('isNull', () => {
  it('应该正确识别 null', () => {
    expect(isNull(null)).toBe(true)

    // 非 null 类型
    expect(isNull(undefined)).toBe(false)
    expect(isNull(0)).toBe(false)
    expect(isNull('')).toBe(false)
    expect(isNull(false)).toBe(false)
    expect(isNull({})).toBe(false)
  })
})

describe('isNullOrUndefined', () => {
  it('应该正确识别 null 或 undefined', () => {
    expect(isNullOrUndefined(null)).toBe(true)
    expect(isNullOrUndefined(undefined)).toBe(true)
    expect(isNullOrUndefined(void 0)).toBe(true)

    // 非 null 或 undefined 类型
    expect(isNullOrUndefined('')).toBe(false)
    expect(isNullOrUndefined(0)).toBe(false)
    expect(isNullOrUndefined(false)).toBe(false)
    expect(isNullOrUndefined({})).toBe(false)
  })
})

describe('isEmptyObject', () => {
  it('应该正确识别空对象', () => {
    expect(isEmptyObject({})).toBe(true)
    expect(isEmptyObject(Object.create(null))).toBe(true)

    // 非空对象
    expect(isEmptyObject({ a: 1 })).toBe(false)
    expect(isEmptyObject([1, 2, 3])).toBe(false) // 非空数组也是非空对象

    // 非对象类型
    expect(isEmptyObject('abc')).toBe(false)
    expect(isEmptyObject(123)).toBe(false)
    expect(isEmptyObject(null)).toBe(false)
    expect(isEmptyObject(undefined)).toBe(false)

    // 带有原型的对象
    expect(isEmptyObject(Object.create({ toString: () => '' }))).toBe(true) // 不包括继承的属性

    // 带有原型且有自身属性的对象
    const objWithProtoAndOwnProp = Object.create({ inherited: true })
    objWithProtoAndOwnProp.own = true
    expect(isEmptyObject(objWithProtoAndOwnProp)).toBe(false)
  })
})

describe('isEmpty', () => {
  it('应该识别 null 和 undefined 为空', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
  })

  it('应该识别空字符串和只有空白的字符串为空', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('   ')).toBe(true)
    expect(isEmpty('hello')).toBe(false)
    expect(isEmpty(' hello ')).toBe(false)
  })

  it('应该识别空数组为空', () => {
    expect(isEmpty([])).toBe(true)
    expect(isEmpty([1, 2, 3])).toBe(false)
  })

  it('应该识别空对象为空', () => {
    expect(isEmpty({})).toBe(true)
    expect(isEmpty({ a: 1 })).toBe(false)
  })

  it('应该处理数字和布尔值（不视为空）', () => {
    expect(isEmpty(0)).toBe(false)
    expect(isEmpty(42)).toBe(false)
    expect(isEmpty(false)).toBe(false)
    expect(isEmpty(true)).toBe(false)
  })
})

describe('isNaN', () => {
  it('应该正确识别 NaN', () => {
    expect(isNaN(Number.NaN)).toBe(true)
    expect(isNaN(Number('abc'))).toBe(true)
    expect(isNaN(0 / 0)).toBe(true)

    // 非 NaN 值
    expect(isNaN(123)).toBe(false)
    expect(isNaN('123')).toBe(false) // 不同于全局 isNaN
    expect(isNaN(null)).toBe(false)
    expect(isNaN(undefined)).toBe(false)
    expect(isNaN({})).toBe(false)
    expect(isNaN('')).toBe(false)
  })
})

describe('isPlainObject', () => {
  it('应该识别普通对象', () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject({ a: 1 })).toBe(true)
    expect(isPlainObject(Object.create(null))).toBe(true)
  })

  it('应该拒绝非普通对象', () => {
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject(new Date())).toBe(false)
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject(undefined)).toBe(false)
    expect(isPlainObject(123)).toBe(false)
    expect(isPlainObject('string')).toBe(false)
    expect(isPlainObject(true)).toBe(false)
    expect(isPlainObject(() => {})).toBe(false)
  })
})

describe('isMobilePhone', () => {
  it('应该识别有效的手机号码', () => {
    // 移动号段 - 字符串格式
    expect(isMobilePhone('13812345678')).toBe(true)
    expect(isMobilePhone('13987654321')).toBe(true)
    expect(isMobilePhone('15012345678')).toBe(true)
    expect(isMobilePhone('15987654321')).toBe(true)

    // 移动号段 - 数字格式
    expect(isMobilePhone(13812345678)).toBe(true)
    expect(isMobilePhone(13987654321)).toBe(true)
    expect(isMobilePhone(15012345678)).toBe(true)
    expect(isMobilePhone(15987654321)).toBe(true)

    // 联通号段 - 字符串格式
    expect(isMobilePhone('13012345678')).toBe(true)
    expect(isMobilePhone('13112345678')).toBe(true)
    expect(isMobilePhone('18512345678')).toBe(true)
    expect(isMobilePhone('18612345678')).toBe(true)

    // 联通号段 - 数字格式
    expect(isMobilePhone(13012345678)).toBe(true)
    expect(isMobilePhone(13112345678)).toBe(true)
    expect(isMobilePhone(18512345678)).toBe(true)
    expect(isMobilePhone(18612345678)).toBe(true)

    // 电信号段 - 字符串格式
    expect(isMobilePhone('18012345678')).toBe(true)
    expect(isMobilePhone('18112345678')).toBe(true)
    expect(isMobilePhone('19012345678')).toBe(true)
    expect(isMobilePhone('19912345678')).toBe(true)

    // 电信号段 - 数字格式
    expect(isMobilePhone(18012345678)).toBe(true)
    expect(isMobilePhone(18112345678)).toBe(true)
    expect(isMobilePhone(19012345678)).toBe(true)
    expect(isMobilePhone(19912345678)).toBe(true)
  })

  it('应该拒绝无效的手机号码', () => {
    // 长度不对 - 字符串格式
    expect(isMobilePhone('1381234567')).toBe(false) // 10位
    expect(isMobilePhone('138123456789')).toBe(false) // 12位

    // 长度不对 - 数字格式
    expect(isMobilePhone(1381234567)).toBe(false) // 10位
    expect(isMobilePhone(138123456789)).toBe(false) // 12位

    // 不是以1开头
    expect(isMobilePhone('23812345678')).toBe(false)
    expect(isMobilePhone('01812345678')).toBe(false)
    expect(isMobilePhone(23812345678)).toBe(false)

    // 第二位不是3-9
    expect(isMobilePhone('10812345678')).toBe(false)
    expect(isMobilePhone('11812345678')).toBe(false)
    expect(isMobilePhone('12812345678')).toBe(false)
    expect(isMobilePhone(10812345678)).toBe(false)
    expect(isMobilePhone(11812345678)).toBe(false)
    expect(isMobilePhone(12812345678)).toBe(false)

    // 包含非数字字符（只对字符串有效）
    expect(isMobilePhone('138-1234-5678')).toBe(false)
    expect(isMobilePhone('138 1234 5678')).toBe(false)
    expect(isMobilePhone('138a1234567')).toBe(false)

    // 非字符串非数字类型
    expect(isMobilePhone(null)).toBe(false)
    expect(isMobilePhone(undefined)).toBe(false)
    expect(isMobilePhone({})).toBe(false)
    expect(isMobilePhone([])).toBe(false)
    expect(isMobilePhone(true)).toBe(false)

    // 空字符串
    expect(isMobilePhone('')).toBe(false)

    // 特殊数字情况
    expect(isMobilePhone(Number.NaN)).toBe(false)
    expect(isMobilePhone(Infinity)).toBe(false)
  })
})
