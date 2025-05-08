type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;

type IsOdd<T extends number> =
  Equal<T, number> extends true
    ? false
  : `${T}` extends `${infer N extends number}e${infer E extends number}`
    ? E extends 0
      ? IsOdd<N>
      : false
  : `${T}` extends `${string}.${string}`
    ? false
  : `${T}` extends `${infer _Prefix}${1|3|5|7|9}`
    ? true
    : false;