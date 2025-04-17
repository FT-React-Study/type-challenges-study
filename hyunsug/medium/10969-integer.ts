type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? 1
  : 2;

type StringToUnion<T extends string> = T extends `${infer First}${infer Rest}`
  ? First | StringToUnion<Rest>
  : never;

type IsOnlyZero<T extends string> = StringToUnion<T> extends "0" ? true : false;

type Integer<T extends string | number> = Equal<T, number> extends true
  ? never
  : `${T}` extends `${infer IntegerPart}.${infer DecimalPart}`
  ? IsOnlyZero<DecimalPart> extends true
    ? IntegerPart
    : never
  : T;
