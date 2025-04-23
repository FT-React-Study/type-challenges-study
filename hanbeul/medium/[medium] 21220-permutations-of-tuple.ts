/*
  21220 - Permutations of Tuple
  -------
  by null (@gaac510) #medium #union #tuple #conditional type #recursion

  ### Question

  Given a generic tuple type `T extends unknown[]`, write a type which produces all permutations of `T` as a union.

  For example:

  ```ts
  PermutationsOfTuple<[1, number, unknown]>
  // Should return:
  // | [1, number, unknown]
  // | [1, unknown, number]
  // | [number, 1, unknown]
  // | [unknown, 1, number]
  // | [number, unknown, 1]
  // | [unknown, number ,1]
  ```

  > View on GitHub: https://tsch.js.org/21220
*/

/* _____________ Your Code Here _____________ */

// Permutation 코드 활용
// any, unknwon 처리 실패

// type Permutation<T, K = T> = [T] extends [never]
//   ? []
//   : K extends K
//     ? [K, ...Permutation<Exclude<T, K>>]
//     : never;

// type PermutationsOfTuple<T extends unknown[]> = Permutation<T[number]>;

// 답지 확인
type PermutationsOfTuple<
  T extends unknown[],
  Prev extends unknown[] = []
> = T extends [infer First, ...infer Rest]
  ?
      | [First, ...PermutationsOfTuple<[...Prev, ...Rest]>]
      | (Rest extends [] ? never : PermutationsOfTuple<Rest, [...Prev, First]>)
  : [];

type example = PermutationsOfTuple<[any, unknown]>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect, ExpectFalse } from "@type-challenges/utils";

type cases = [
  Expect<Equal<PermutationsOfTuple<[]>, []>>,
  Expect<Equal<PermutationsOfTuple<[any]>, [any]>>,
  Expect<
    Equal<PermutationsOfTuple<[any, unknown]>, [any, unknown] | [unknown, any]>
  >,
  Expect<
    Equal<
      PermutationsOfTuple<[any, unknown, never]>,
      | [any, unknown, never]
      | [unknown, any, never]
      | [unknown, never, any]
      | [any, never, unknown]
      | [never, any, unknown]
      | [never, unknown, any]
    >
  >,
  Expect<
    Equal<
      PermutationsOfTuple<[1, number, unknown]>,
      | [1, number, unknown]
      | [1, unknown, number]
      | [number, 1, unknown]
      | [unknown, 1, number]
      | [number, unknown, 1]
      | [unknown, number, 1]
    >
  >,
  ExpectFalse<Equal<PermutationsOfTuple<[1, number, unknown]>, [unknown]>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/21220/answer
  > View solutions: https://tsch.js.org/21220/solutions
  > More Challenges: https://tsch.js.org
*/
