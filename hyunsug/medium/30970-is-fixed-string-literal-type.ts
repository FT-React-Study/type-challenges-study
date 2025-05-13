type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type IsUnion<T, U = T> = [T] extends [never]
  ? false
  : T extends T
  ? [U] extends [T]
    ? false
    : true
  : false;

type IsDynamic<T> = Equal<T, string> extends true
  ? true
  : Equal<T, `${bigint}`> extends true
  ? true
  : Equal<T, `${number}`> extends true
  ? true
  : Equal<T, `${boolean}`> extends true
  ? true
  : Equal<T, `${string & {}}`> extends true
  ? true
  : false;

type IsFixedStringLiteralType<S extends string> = [S] extends [never]
  ? false
  : IsUnion<S> extends true
  ? false
  : S extends `${infer F}${infer Rest extends string}`
  ? IsDynamic<F> extends true
    ? false
    : Rest extends ""
    ? true
    : IsFixedStringLiteralType<Rest>
  : false;
