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

type IsContained<T extends Array<any>, A> = 
  T extends [infer First, ...infer Rest] 
    ? (<B>() => B extends A ? 1 : 2) extends
      (<B>() => B extends First ? 1 : 2)
      ? true
      : IsContained<Rest, A>
    : false

type Unique<T, Result extends Array<any> = []> = 
  T extends [infer First, ...infer Rest]
    ? IsContained<Result, First> extends true
      ? Unique<Rest, Result>
      : Unique<Rest, [...Result, First]>
    : Result


/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect, ExpectExtends } from '@type-challenges/utils'

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
