/*
  4425 - Greater Than
  -------
  by ch3cknull (@ch3cknull) #보통 #array

  ### 질문

  In This Challenge, You should implement a type `GreaterThan<T, U>` like `T > U`

  Negative numbers do not need to be considered.

  For example

  ```ts
  GreaterThan<2, 1> //should be true
  GreaterThan<1, 1> //should be false
  GreaterThan<10, 100> //should be false
  GreaterThan<111, 11> //should be true
  ```

  Good Luck!

  > GitHub에서 보기: https://tsch.js.org/4425/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type StringToArray<T extends string> = 
  T extends `${infer First}${infer Rest}`
    ? [First, ...StringToArray<Rest>]
    : []

type StringToNumber<S extends string> = S extends `${infer N extends number}` ? N : never;

type GreaterThanOne<T extends number, U extends number, Count extends Array<any> = []> = 
  Count['length'] extends T
    ? false
    : Count['length'] extends U
      ? true
      : GreaterThanOne<T, U, [...Count, any]>

type GreaterThanArray<T extends Array<any>, U extends Array<any>> = 
  T extends []
    ? false
    : T extends [infer FirstOfT, ...infer RestOfT]
      ? U extends [infer FirstOfU, ...infer RestOfU]
        ? FirstOfT extends FirstOfU
          ? GreaterThanArray<RestOfT, RestOfU>
          : FirstOfT extends string
            ? FirstOfU extends string
              ? GreaterThanOne<StringToNumber<FirstOfT>, StringToNumber<FirstOfU>>
              : never
            : never
        : never
      : never;


type GreaterThan<
  T extends number, 
  U extends number, 
  ArrayT extends Array<string> = StringToArray<`${T}`>,
  ArrayU extends Array<string> = StringToArray<`${U}`>
> = 
  ArrayT['length'] extends ArrayU['length']
    ? GreaterThanArray<ArrayT, ArrayU>
    : GreaterThanOne<ArrayT['length'], ArrayU['length']>
      
/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<GreaterThan<1, 0>, true>>,
  Expect<Equal<GreaterThan<5, 4>, true>>,
  Expect<Equal<GreaterThan<4, 5>, false>>,
  Expect<Equal<GreaterThan<0, 0>, false>>,
  Expect<Equal<GreaterThan<10, 9>, true>>,
  Expect<Equal<GreaterThan<20, 20>, false>>,
  Expect<Equal<GreaterThan<10, 100>, false>>,
  Expect<Equal<GreaterThan<111, 11>, true>>,
  Expect<Equal<GreaterThan<1234567891011, 1234567891010>, true>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/4425/answer/ko
  > 정답 보기: https://tsch.js.org/4425/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
