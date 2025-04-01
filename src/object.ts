/**
 * 对象操作相关的工具函数
 */

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  const cloned: Record<string, any> = {};
  Object.keys(obj as Record<string, any>).forEach((key) => {
    cloned[key] = deepClone((obj as Record<string, any>)[key]);
  });

  return cloned as T;
}

/**
 * 从对象中获取指定路径的值，支持点分隔的路径
 * @param obj 对象
 * @param path 路径，如 'user.address.street'
 * @param defaultValue 默认值，当路径不存在时返回
 * @returns 路径对应的值或默认值
 */
export function get<T = any>(obj: Record<string, any>, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue;
    }
    result = result[key];
  }

  return (result === undefined) ? defaultValue : result as T;
}

/**
 * 从对象中选择指定的属性
 * @param obj 原始对象
 * @param keys 要选择的键数组
 * @returns 包含指定键的新对象
 */
export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

/**
 * 从对象中排除指定的属性
 * @param obj 原始对象
 * @param keys 要排除的键数组
 * @returns 不包含指定键的新对象
 */
export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

/**
 * 将对象转换为查询字符串
 * @param obj 要转换的对象
 * @returns 查询字符串
 */
export function objectToQueryString(obj: Record<string, any>): string {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(item => `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join('&');
}

/**
 * 检查对象是否为空（没有自身的可枚举属性）
 * @param obj 要检查的对象
 * @returns 是否为空对象
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * 合并多个对象，后面的对象的属性会覆盖前面的
 * @param objects 要合并的对象数组
 * @returns 合并后的新对象
 */
export function merge<T extends Record<string, any>>(...objects: T[]): T {
  return Object.assign({}, ...objects);
} 
