type ReverseArgs<Args extends any[]> = Args extends [infer First, ...infer Rest]
  ? [...ReverseArgs<Rest>, First]
  : Args;

type FlipArguments<T extends (...args: any[]) => any> = T extends (
  ...args: infer Args
) => infer R
  ? (...args: ReverseArgs<Args>) => R
  : never;

type Flipped = FlipArguments<
  (arg0: string, arg1: number, arg2: boolean) => void
>;
// (arg0: boolean, arg1: number, arg2: string) => void
