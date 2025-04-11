/*
  8987 - Subsequence
  -------
  by jiangshan (@jiangshanmeta) #medium #union

  ### Question

  Given an array of unique elements, return all possible subsequences.

  A subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements.

  For example:

  ```typescript
  type A = Subsequence<[1, 2]> // [] | [1] | [2] | [1, 2]
  ```

  > View on GitHub: https://tsch.js.org/8987
*/

/* _____________ Your Code Here _____________ */

// 기존 콤비네이션을 활용하면 되지 않을까?
// 일단 튜플을 유니온으로 만든 다음에
// 각 요소로 콤비네이션 만들어서 리턴해주기
// type Combination<A extends string, B extends string> =
//   | [A]
//   | [B]
//   | [A, B]

// type UnionCombination<A extends string, B extends string = A> = A extends B
//   ? Combination<A, UnionCombination<Exclude<B, A>>>
//   : never;

// type Subsequence<T extends any[]> = UnionCombination<T[number]>

// 다른 방법 필요...
// 훨씬 이지한 방법이 있었네
type Subsequence<T extends any[]> = T extends [infer First, ...infer Rest]
  ? Subsequence<Rest> | [First, ...Subsequence<Rest>]
  : [];

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<Subsequence<[1, 2]>, [] | [1] | [2] | [1, 2]>>,
  Expect<
    Equal<
      Subsequence<[1, 2, 3]>,
      [] | [1] | [2] | [1, 2] | [3] | [1, 3] | [2, 3] | [1, 2, 3]
    >
  >,
  Expect<
    Equal<
      Subsequence<[1, 2, 3, 4, 5]>,
      | []
      | [1]
      | [2]
      | [3]
      | [4]
      | [5]
      | [1, 2]
      | [1, 3]
      | [1, 4]
      | [1, 5]
      | [2, 3]
      | [2, 4]
      | [2, 5]
      | [3, 4]
      | [3, 5]
      | [4, 5]
      | [1, 2, 3]
      | [1, 2, 4]
      | [1, 2, 5]
      | [1, 3, 4]
      | [1, 3, 5]
      | [1, 4, 5]
      | [2, 3, 4]
      | [2, 3, 5]
      | [2, 4, 5]
      | [3, 4, 5]
      | [1, 2, 3, 4]
      | [1, 2, 3, 5]
      | [1, 2, 4, 5]
      | [1, 3, 4, 5]
      | [2, 3, 4, 5]
      | [1, 2, 3, 4, 5]
    >
  >,
  Expect<
    Equal<
      Subsequence<["a", "b", "c"]>,
      | []
      | ["a"]
      | ["b"]
      | ["c"]
      | ["a", "b"]
      | ["a", "c"]
      | ["b", "c"]
      | ["a", "b", "c"]
    >
  >,
  Expect<Equal<Subsequence<["x", "y"]>, [] | ["x"] | ["y"] | ["x", "y"]>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/8987/answer
  > View solutions: https://tsch.js.org/8987/solutions
  > More Challenges: https://tsch.js.org
*/
