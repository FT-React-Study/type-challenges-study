/*
  27932 - MergeAll
  -------
  by scarf (@scarf005) #보통 #object #array #union

  ### 질문

  Merge variadic number of types into a new type. If the keys overlap, its values should be merged into an union.

  For example:

  ```ts
  type Foo = { a: 1; b: 2 }
  type Bar = { a: 2 }
  type Baz = { c: 3 }

  type Result = MergeAll<[Foo, Bar, Baz]> // expected to be { a: 1 | 2; b: 2; c: 3 }
  ```

  > GitHub에서 보기: https://tsch.js.org/27932/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type MergeObject<T, U> = Omit<
  {
    [K in keyof T]: K extends keyof U ? T[K] | U[K] : T[K]
  } & 
  {
    [K in keyof U]: K extends keyof T ? T[K] | U[K] : U[K]
  }, never>;

type MergeAll<T extends unknown[]> = T extends [] ? {} :
  T extends [infer F, ...infer R] ?
    MergeObject<F, MergeAll<R>> :
    T;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MergeAll<[]>, {} >>,
  Expect<Equal<MergeAll<[{ a: 1 }]>, { a: 1 }>>,
  Expect<Equal<
    MergeAll<[{ a: string }, { a: string }]>,
    { a: string }
>
  >,
  Expect<Equal<
    MergeAll<[{ }, { a: string }]>,
    { a: string }
>
  >,
  Expect<Equal<
    MergeAll<[{ a: 1 }, { c: 2 }]>,
    { a: 1, c: 2 }
>
  >,
  Expect<Equal<
    MergeAll<[{ a: 1, b: 2 }, { a: 2 }, { c: 3 }]>,
    { a: 1 | 2, b: 2, c: 3 }
>
  >,
  Expect<Equal<MergeAll<[{ a: 1 }, { a: number }]>, { a: number }>>,
  Expect<Equal<MergeAll<[{ a: number }, { a: 1 }]>, { a: number }>>,
  Expect<Equal<MergeAll<[{ a: 1 | 2 }, { a: 1 | 3 }]>, { a: 1 | 2 | 3 }>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/27932/answer/ko
  > 정답 보기: https://tsch.js.org/27932/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
