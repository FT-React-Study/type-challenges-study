type MyParameters<T extends (...args: any[]) => unknown> = T extends (
  ...args: infer P
) => unknown
  ? P
  : never;

// Original
const foo = (arg1: string, arg2: number): void => {};

type FunctionParamsType = MyParameters<typeof foo>; // [arg1: string, arg2: number]
