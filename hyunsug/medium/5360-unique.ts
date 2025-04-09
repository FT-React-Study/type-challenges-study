type Same<A, B> = (<T>() => T extends A ? 1 : 2) extends <P>() => P extends B
  ? 1
  : 2
  ? true
  : false;

type Includes<T extends readonly unknown[], U> = T extends [
  infer First,
  ...infer Rest
]
  ? Same<First, U> extends true
    ? true
    : Includes<Rest, U>
  : false;

type Unique<
  T extends readonly unknown[],
  Uniques extends unknown[] = []
> = T extends [infer First, ...infer Rest]
  ? Includes<Uniques, First> extends true
    ? Unique<Rest, Uniques>
    : Unique<Rest, [...Uniques, First]>
  : Uniques;
