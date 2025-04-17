type ToPrimitive<T> = T extends (...args: any[]) => any
  ? Function
  : T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends readonly any[]
  ? { [K in keyof T]: ToPrimitive<T[K]> }
  : T extends object
  ? { [K in keyof T]: ToPrimitive<T[K]> }
  : T;
