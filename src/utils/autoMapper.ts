type Constructor<T> = {
  new (): T
}

/**
 * 自动映射
 * @param source 源对象
 * @param Model 目标对象
 */
export const autoMapper = <T extends Record<string, unknown>>(source: Partial<T>, Model: Constructor<T>): T => {
  const target = new Model()
  Object.keys(source).forEach((key: string) => {
    if (key in target) {
      ;(target as any)[key] = (source as any)[key]
    }
  })
  return target
}
