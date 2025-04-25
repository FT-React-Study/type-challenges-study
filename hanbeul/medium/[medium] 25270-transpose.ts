/*
  25270 - Transpose
  -------
  by Apollo Wayne (@Shinerising) #medium #array #math

  ### Question

  The transpose of a matrix is an operator which flips a matrix over its diagonal; that is, it switches the row and column indices of the matrix A by producing another matrix, often denoted by A<sup>T</sup>.

  ```ts
  type Matrix = Transpose <[[1]]>; // expected to be [[1]]
  type Matrix1 = Transpose <[[1, 2], [3, 4]]>; // expected to be [[1, 3], [2, 4]]
  type Matrix2 = Transpose <[[1, 2, 3], [4, 5, 6]]>; // expected to be [[1, 4], [2, 5], [3, 6]]
  ```

  > View on GitHub: https://tsch.js.org/25270
*/

/* _____________ Your Code Here _____________ */

// 진짜 감도 안오네..
// 우선 튜플을 먼저 순회하면서,
// 각 튜플을 infer로 분리해서 같은 index들을 모아야하나?
// type GetElementByIndex<T extends any[], Idx extends number, Cnt extends any[] = []> =
//   T extends [infer First, ...infer Rest]
//     ? Cnt['length'] extends Idx
//       ? First
//       : GetElementByIndex<Rest, Idx, [...Cnt, unknown]>
//     : never;

// type PickColumn<M extends any[][], Idx extends number> = {
//   [K in keyof M]: GetElementByIndex<M[K], Idx>
// };

// type Transpose<M extends number[][]> =
//   M extends [infer FirstRow extends any[], ...any]
//     ? { [K in keyof FirstRow]: PickColumn<M, Extract<K, number>> }
//     : [];

type Transpose<M extends number[][], R = M["length"] extends 0 ? [] : M[0]> = {
  [X in keyof R]: {
    [Y in keyof M]: X extends keyof M[Y] ? M[Y][X] : never;
  };
};

type example = Transpose<[[1, 2, 3], [4, 5, 6], [7, 8, 9]]>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<Transpose<[]>, []>>,
  Expect<Equal<Transpose<[[1]]>, [[1]]>>,
  Expect<Equal<Transpose<[[1, 2]]>, [[1], [2]]>>,
  Expect<Equal<Transpose<[[1, 2], [3, 4]]>, [[1, 3], [2, 4]]>>,
  Expect<Equal<Transpose<[[1, 2, 3], [4, 5, 6]]>, [[1, 4], [2, 5], [3, 6]]>>,
  Expect<Equal<Transpose<[[1, 4], [2, 5], [3, 6]]>, [[1, 2, 3], [4, 5, 6]]>>,
  Expect<
    Equal<
      Transpose<[[1, 2, 3], [4, 5, 6], [7, 8, 9]]>,
      [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
    >
  >
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/25270/answer
  > View solutions: https://tsch.js.org/25270/solutions
  > More Challenges: https://tsch.js.org
*/
