type Same<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;

type Includes<T extends any[], U> = T extends [infer F, ...infer R]
  ? Same<F, U> extends true
    ? true
    : Includes<R, U>
  : false;

type FindEles<
  T extends any[],
  Unique extends any[] = [],
  Repeated extends any[] = []
> = T extends [infer F, ...infer R]
  ? Includes<R, F> extends true
    ? FindEles<R, Unique, [...Repeated, F]>
    : Includes<Repeated, F> extends true
    ? FindEles<R, Unique, Repeated>
    : FindEles<R, [...Unique, F], Repeated>
  : Unique;
