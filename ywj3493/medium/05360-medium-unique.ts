/*
  5360 - Unique
  -------
  by Pineapple (@Pineapple0919) #보통 #array

  ### 질문

  Implement the type version of Lodash.uniq, Unique<T> takes an Array T, returns the Array T without repeated values.

  ```ts
  type Res = Unique<[1, 1, 2, 2, 3, 3]>; // expected to be [1, 2, 3]
  type Res1 = Unique<[1, 2, 3, 4, 4, 5, 6, 7]>; // expected to be [1, 2, 3, 4, 5, 6, 7]
  type Res2 = Unique<[1, "a", 2, "b", 2, "a"]>; // expected to be [1, "a", 2, "b"]
  type Res3 = Unique<[string, number, 1, "a", 1, string, 2, "b", 2, number]>; // expected to be [string, number, 1, "a", 2, "b"]
  type Res4 = Unique<[unknown, unknown, any, any, never, never]>; // expected to be [unknown, any, never]
  ```

  > GitHub에서 보기: https://tsch.js.org/5360/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

// type Unique<T extends unknown[], U = never, Acc extends unknown[] = []> = T extends [infer F, ...infer R] ? 
//   F extends U ? 
//     Unique<R, U, Acc>: 
//     Unique<R, U | F, [...Acc, F]>:
//   Acc;

// type Test = Unique<[string, number, 1, 'a', 1, string, 2, 'b', 2, number]>

type Includes<T extends readonly unknown[], U> =
  T extends [infer F, ...infer R]
    ? Equal<F, U> extends true
      ? true
      : Includes<R, U>
    : false;

type Unique<T extends unknown[], Acc extends unknown[] = []> =
  T extends [infer F, ...infer R]
    ? Includes<Acc, F> extends true
      ? Unique<R, Acc>
      : Unique<R, [...Acc, F]>
    : Acc;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Unique<[1, 1, 2, 2, 3, 3]>, [1, 2, 3]>>,
  Expect<Equal<Unique<[1, 2, 3, 4, 4, 5, 6, 7]>, [1, 2, 3, 4, 5, 6, 7]>>,
  Expect<Equal<Unique<[1, 'a', 2, 'b', 2, 'a']>, [1, 'a', 2, 'b']>>,
  Expect<Equal<Unique<[string, number, 1, 'a', 1, string, 2, 'b', 2, number]>, [string, number, 1, 'a', 2, 'b']>>,
  Expect<Equal<Unique<[unknown, unknown, any, any, never, never]>, [unknown, any, never]>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/5360/answer/ko
  > 정답 보기: https://tsch.js.org/5360/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
