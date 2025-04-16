/*
  9898 - Appear only once
  -------
  by X.Q. Chen (@brenner8023) #medium

  ### Question

  Find the elements in the target array that appear only once. For example：input: `[1,2,2,3,3,4,5,6,6,6]`，ouput: `[1,4,5]`.

  > View on GitHub: https://tsch.js.org/9898
*/

/* _____________ Your Code Here _____________ */

// 각 글자 돌면서 unique 한지 판단, unique 한 애들만 모아서 리턴
type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type IsUniqueInArray<
  T extends any[],
  E,
  CountArr extends unknown[] = []
> = T extends [infer First, ...infer Rest]
  ? IsEqual<First, E> extends true
    ? IsUniqueInArray<Rest, E, [...CountArr, unknown]>
    : IsUniqueInArray<Rest, E, CountArr>
  : CountArr["length"] extends 1
  ? true
  : false;

type FindEles<
  T extends any[],
  Original extends any[] = T,
  Result extends any[] = []
> = T extends [infer First, ...infer Rest]
  ? IsUniqueInArray<Original, First> extends true
    ? FindEles<Rest, Original, [...Result, First]>
    : FindEles<Rest, Original, Result>
  : Result;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<FindEles<[1, 2, 2, 3, 3, 4, 5, 6, 6, 6]>, [1, 4, 5]>>,
  Expect<Equal<FindEles<[2, 2, 3, 3, 6, 6, 6]>, []>>,
  Expect<Equal<FindEles<[1, 2, 3]>, [1, 2, 3]>>,
  Expect<Equal<FindEles<[1, 2, number]>, [1, 2, number]>>,
  Expect<Equal<FindEles<[1, 2, number, number]>, [1, 2]>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/9898/answer
  > View solutions: https://tsch.js.org/9898/solutions
  > More Challenges: https://tsch.js.org
*/
