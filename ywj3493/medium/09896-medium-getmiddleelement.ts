/*
  9896 - GetMiddleElement
  -------
  by 凤之兮原 (@kongmingLatern) #보통

  ### 질문

  Get the middle element of the array by implementing a `GetMiddleElement` method, represented by an array

  > If the length of the array is odd, return the middle element
  > If the length of the array is even, return the middle two elements

  For example

  ```ts
    type simple1 = GetMiddleElement<[1, 2, 3, 4, 5]>, // expected to be [3]
    type simple2 = GetMiddleElement<[1, 2, 3, 4, 5, 6]> // expected to be [3, 4]
  ```

  > GitHub에서 보기: https://tsch.js.org/9896/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type IsEven<T extends number, C extends never[] = [], R extends boolean = true> = C['length'] extends T ? R : IsEven<T, [...C, never], R extends true ? false : true>;

type IsEvenTest = IsEven<999>;
type IsEvenTest2 = IsEven<998>;

type SmallMinusOne<T extends number, C extends never[] = []> = C['length'] extends T ? C extends [infer _, ...infer R] ? R['length'] : never : SmallMinusOne<T, [...C, never]>;

type SmallMinusOneTest = SmallMinusOne<999>;

type SmallPlusOne<T extends number, C extends never[] = []> = C['length'] extends T ? [...C, never]['length'] : SmallPlusOne<T, [...C, never]>;

type SmallPlusOneTest = SmallPlusOne<999>;

type GetMiddleElementForOdd<T extends unknown[], Forward extends number = 0, Backward extends number = SmallMinusOne<T['length']>> = Forward extends Backward ? 
  [T[Forward]] : 
  GetMiddleElementForOdd<T, SmallPlusOne<Forward>, SmallMinusOne<Backward>>;

type GetMiddleElementForOddTest = GetMiddleElementForOdd<[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]>;

type GetMiddleElementForEven<T extends unknown[], Forward extends number = 0, Backward extends number = SmallMinusOne<T['length']>> = T['length'] extends 0 ? [] : 
  Forward extends SmallMinusOne<Backward> ? 
    [T[Forward], T[Backward]] :
    GetMiddleElementForEven<T, SmallPlusOne<Forward>, SmallMinusOne<Backward>>;

type GetMiddleElementForEvenTest = GetMiddleElementForEven<[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]>;

type GetMiddleElement<T extends unknown[]> = IsEven<T['length']> extends true ? GetMiddleElementForEven<T> : GetMiddleElementForOdd<T>;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<GetMiddleElement<[]>, []>>,
  Expect<Equal<GetMiddleElement<[1, 2, 3, 4, 5]>, [3]>>,
  Expect<Equal<GetMiddleElement<[1, 2, 3, 4, 5, 6]>, [3, 4]>>,
  Expect<Equal<GetMiddleElement<[() => string]>, [() => string]>>,
  Expect<Equal<GetMiddleElement<[() => number, '3', [3, 4], 5]>, ['3', [3, 4]]>>,
  Expect<Equal<GetMiddleElement<[() => string, () => number]>, [() => string, () => number]>>,
  Expect<Equal<GetMiddleElement<[never]>, [never]>>,
]
// @ts-expect-error
type error = GetMiddleElement<1, 2, 3>

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/9896/answer/ko
  > 정답 보기: https://tsch.js.org/9896/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
