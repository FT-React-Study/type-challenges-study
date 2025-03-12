type FunctionBase = (...args: any[]) => any;

type AppendArgument<Fn extends FunctionBase, NewArgument> = Fn extends (
  ...args: infer Args
) => infer Return
  ? (...args: readonly [...Args, x: NewArgument]) => Return
  : never;

type Fn = (a: number, b: string) => number;

type Result = AppendArgument<Fn, boolean>;
// expected be (a: number, b: string, x: boolean) => number

type Case1 = AppendArgument<(a: number, b: string) => number, boolean>;
type Result1 = (a: number, b: string, x: boolean) => number;

type Case2 = AppendArgument<() => void, undefined>;
type Result2 = (x: undefined) => void;

// @ts-expect-error
type Case3 = AppendArgument<unknown, undefined>;
