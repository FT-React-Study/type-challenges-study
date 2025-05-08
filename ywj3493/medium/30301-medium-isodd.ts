/*
  30301 - IsOdd
  -------
  by jiangshan (@jiangshanmeta) #보통 #string

  ### 질문

  return true is a number is odd

  > GitHub에서 보기: https://tsch.js.org/30301/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type IsOddForSmall<T extends number, C extends never[] = [], OddFlag extends boolean = false> = C['length'] extends T ? 
  OddFlag :
  IsOddForSmall<T, [...C, never], OddFlag extends true ? false : true>;

type ReverseSplitString<T extends string, C extends string[] = []> = T extends `${infer First}${infer Rest}` ? ReverseSplitString<Rest, [First, ...C]> : C;

type GetModDecimal<T extends number> = ReverseSplitString<`${T}`>[0] extends `${infer N extends number}` ? N : T;

type IsOdd<T extends number> = 
  // 소수점 처리
  `${T}` extends `${string}.${string}` ? false : 
  // 지수 표현 처리
  `${T}` extends `${string}e${infer L extends number}` ? L extends 0 ?  true : false :
  // 정수 처리
  IsOddForSmall<GetModDecimal<T>>;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<IsOdd<5>, true>>,
  Expect<Equal<IsOdd<2023>, true>>,
  Expect<Equal<IsOdd<1453>, true>>,
  Expect<Equal<IsOdd<1926>, false>>,
  Expect<Equal<IsOdd<2.3>, false>>,
  Expect<Equal<IsOdd<3e23>, false>>,
  Expect<Equal<IsOdd<3.211e3>, true>>,
  Expect<Equal<IsOdd<number>, false>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/30301/answer/ko
  > 정답 보기: https://tsch.js.org/30301/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
