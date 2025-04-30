/*
  27958 - CheckRepeatedTuple
  -------
  by bowen (@jiaowoxiaobala) #medium

  ### Question

  Implement type `CheckRepeatedChars<T>` which will return whether type `T` contains duplicated member

  For example:

  ```ts
  type CheckRepeatedTuple<[1, 2, 3]>   // false
  type CheckRepeatedTuple<[1, 2, 1]>   // true
  ```

  > View on GitHub: https://tsch.js.org/27958
*/

/* _____________ Your Code Here _____________ */

// 그냥 각 요소 하나씩 돌면서
// 전체랑 비교해서
// 같은 개수가 1이면 return true
// 1이 아니면 return false

type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type IsRepeat<T extends unknown[], El, Cnt extends unknown[] = []> = T extends [
  infer First,
  ...infer Rest
]
  ? IsEqual<First, El> extends true
    ? IsRepeat<Rest, El, [...Cnt, unknown]>
    : IsRepeat<Rest, El, Cnt>
  : Cnt["length"] extends 1
  ? false
  : true;

type CheckRepeatedTuple<T extends unknown[]> = T extends [
  infer First,
  ...infer Rest
]
  ? IsRepeat<T, First> extends true
    ? true
    : CheckRepeatedTuple<Rest>
  : false;

type example = IsEqual<number, number>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<CheckRepeatedTuple<[number, number, string, boolean]>, true>>,
  Expect<Equal<CheckRepeatedTuple<[number, string]>, false>>,
  Expect<Equal<CheckRepeatedTuple<[1, 2, 3]>, false>>,
  Expect<Equal<CheckRepeatedTuple<[1, 2, 1]>, true>>,
  Expect<Equal<CheckRepeatedTuple<[]>, false>>,
  Expect<Equal<CheckRepeatedTuple<string[]>, false>>,
  Expect<
    Equal<
      CheckRepeatedTuple<
        [number, 1, string, "1", boolean, true, false, unknown, any]
      >,
      false
    >
  >,
  Expect<Equal<CheckRepeatedTuple<[never, any, never]>, true>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/27958/answer
  > View solutions: https://tsch.js.org/27958/solutions
  > More Challenges: https://tsch.js.org
*/
