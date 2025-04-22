type Insertion<T extends unknown[], U> = T extends [infer F, ...infer R]
  ? [F, U, ...R] | [F, ...Insertion<R, U>]
  : [U];

type PermutationsOfTuple<
  T extends unknown[],
  Result extends unknown[] = []
> = T extends [infer F, ...infer R]
  ? PermutationsOfTuple<R, [F, ...Result] | Insertion<Result, F>>
  : Result;
