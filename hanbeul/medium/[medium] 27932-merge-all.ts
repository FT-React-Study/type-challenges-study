/*
  27932 - MergeAll
  -------
  by scarf (@scarf005) #medium #object #array #union

  ### Question

  Merge variadic number of types into a new type. If the keys overlap, its values should be merged into an union.

  For example:

  ```ts
  type Foo = { a: 1; b: 2 }
  type Bar = { a: 2 }
  type Baz = { c: 3 }

  type Result = MergeAll<[Foo, Bar, Baz]> // expected to be { a: 1 | 2; b: 2; c: 3 }
  ```

  > View on GitHub: https://tsch.js.org/27932
*/

/* _____________ Your Code Here _____________ */

// 어레이를 순회
// 키값으로 순회할까 했는데, 그러면 바로 오브젝트에서 뭔가 해야될거같은데, 비교 로직을 못만들듯
// 그러면 그냥 extends 로 순회하자
// 각 요소의 키 값을 확인해서, result의 키에 존재하는지 확인
// 존재할 경우 머지, 존재하지 않을 경우 추가
// type MergeAll<XS extends any[], Result = {}> =
//   XS extends [infer First, ...infer Rest]
//     ? { [Key in keyof Result]: Key extends keyof First ? Result[Key] | First[Key] : Result[Key] }.. 어쩌구
//     : Result

// 기존 Merge 로직 사용
// type Merge<F, S> = {
//   [P in keyof F | keyof S]: P extends keyof S
//     ? S[P]
//     : P extends keyof F
//       ? F[P]
//       : never;
// };

// 기존 Merge는 | 가 아니라 냅다 합쳐버림
type Merge<F, S> = {
  [K in keyof F | keyof S]: K extends keyof F
    ? K extends keyof S
      ? F[K] | S[K]
      : F[K]
    : K extends keyof S
    ? S[K]
    : never;
};

type MergeAll<T extends object[], Result = {}> = T extends [
  infer First extends object,
  ...infer Rest extends object[]
]
  ? MergeAll<Rest, Merge<Result, First>>
  : Result;

type example = MergeAll<[{ a: 1; b: 2 }, { a: 2 }, { c: 3 }]>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<MergeAll<[]>, {}>>,
  Expect<Equal<MergeAll<[{ a: 1 }]>, { a: 1 }>>,
  Expect<Equal<MergeAll<[{ a: string }, { a: string }]>, { a: string }>>,
  Expect<Equal<MergeAll<[{}, { a: string }]>, { a: string }>>,
  Expect<Equal<MergeAll<[{ a: 1 }, { c: 2 }]>, { a: 1; c: 2 }>>,
  Expect<
    Equal<
      MergeAll<[{ a: 1; b: 2 }, { a: 2 }, { c: 3 }]>,
      { a: 1 | 2; b: 2; c: 3 }
    >
  >,
  Expect<Equal<MergeAll<[{ a: 1 }, { a: number }]>, { a: number }>>,
  Expect<Equal<MergeAll<[{ a: number }, { a: 1 }]>, { a: number }>>,
  Expect<Equal<MergeAll<[{ a: 1 | 2 }, { a: 1 | 3 }]>, { a: 1 | 2 | 3 }>>
];

/* _____________ Further Steps _____________ */
/*
> Share your solutions: https://tsch.js.org/27932/answer
> View solutions: https://tsch.js.org/27932/solutions
> More Challenges: https://tsch.js.org
*/
