/*
  2257 - MinusOne
  -------
  by Mustafo Faiz (@fayzzzm) #보통 #math

  ### 질문

  Given a number (always positive) as a type. Your type should return the number decreased by one.

  For example:

  ```ts
  type Zero = MinusOne<1> // 0
  type FiftyFour = MinusOne<55> // 54
  ```

  > GitHub에서 보기: https://tsch.js.org/2257/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

// 숫자 빼기 맵퍼
type RotateDigitString<T extends string> = T extends "0" ? "9" : 
  T extends "1" ? "0" : 
  T extends "2" ? "1" :
  T extends "3" ? "2" :
  T extends "4" ? "3" :
  T extends "5" ? "4" :
  T extends "6" ? "5" :
  T extends "7" ? "6" :
  T extends "8" ? "7" :
  T extends "9" ? "8" : 
never;
type RotateDigitStringTest = RotateDigitString<"0">;

// 전체를 변경해야함
type StringToNumber<T extends string> = T extends `${infer Num extends number}` ? Num : never;
type StringToNumberTest1 = StringToNumber<"00">
type StringToNumberTest2 = StringToNumber<"1">

type ReverseSplitString<T extends string, C extends string[] = []> = T extends `${infer First}${infer Rest}` ? ReverseSplitString<Rest, [First, ...C]> : C;
type ReverseSplitStringTest1 = ReverseSplitString<"1000">
type ReverseSplitStringTest2 = ReverseSplitString<"1">

type SubstractOne<
  T extends string[],
  Borrow extends boolean = true,
  C extends string[] = []
> = T extends [infer First extends string, ...infer Rest extends string[]]
  ? Borrow extends true
    ? First extends "0"
      ? SubstractOne<Rest, true, [...C, RotateDigitString<First>]> 
      : SubstractOne<Rest, false, [...C, RotateDigitString<First>]> 
    : SubstractOne<Rest, false, [...C, First]>
  : C;
type SubstractOneTest1 = SubstractOne<["1", "1"]>
type SubstractOneTest2 = SubstractOne<["5", "5"]>
type SubstringOneTest3 = SubstractOne<["0", "0", "1"]>
type SubstractOneTest4 = SubstractOne<["1"]>

type ReverseJoinString<T extends string[], C extends string = ""> = T extends [infer First extends string, ...infer Rest extends string[]] ? ReverseJoinString<Rest,`${First}${C}`> : C;
type ReverseJoinStringTest1 = ReverseJoinString<["9", "8", "0"]>
type ReverseJoinStringTest2 = ReverseJoinString<["1"]>

type RemoveZeroPad<T extends string> = T extends `0${infer Rest}` ? Rest extends "" ? "0" : RemoveZeroPad<Rest> : T;
type RemoveZeroPadTest1 = RemoveZeroPad<"0101">
type RemoveZeroPadTest2 = RemoveZeroPad<"0">


type MinusOne<T extends number> = StringToNumber<RemoveZeroPad<ReverseJoinString<SubstractOne<ReverseSplitString<`${T}`>>>>>

type Test = MinusOne<1>

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MinusOne<1>, 0>>,
  Expect<Equal<MinusOne<55>, 54>>,
  Expect<Equal<MinusOne<3>, 2>>,
  Expect<Equal<MinusOne<100>, 99>>,
  Expect<Equal<MinusOne<1101>, 1100>>,
  Expect<Equal<MinusOne<9_007_199_254_740_992>, 9_007_199_254_740_991>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/2257/answer/ko
  > 정답 보기: https://tsch.js.org/2257/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
