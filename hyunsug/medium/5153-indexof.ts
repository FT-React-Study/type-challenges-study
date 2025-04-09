type Same<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;

type IndexOf<
  T extends readonly unknown[],
  U,
  Count extends any[] = []
> = T extends [infer F, ...infer Rest]
  ? Same<F, U> extends true
    ? Count["length"]
    : IndexOf<Rest, U, [...Count, 0]>
  : -1;
