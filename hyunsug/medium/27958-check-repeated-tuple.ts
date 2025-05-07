type Same<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? 1
  : 2;

type Includes<T extends any[], U> = T extends [infer F, ...infer R]
  ? Same<F, U> extends true
    ? true
    : Includes<R, U>
  : false;

type CheckRepeatedTuple<
  T extends unknown[],
  Passed extends unknown[] = []
> = T extends [infer F, ...infer R]
  ? Includes<Passed, F> extends true
    ? true
    : Includes<R, F> extends true
    ? true
    : CheckRepeatedTuple<R, [...Passed, F]>
  : false;
