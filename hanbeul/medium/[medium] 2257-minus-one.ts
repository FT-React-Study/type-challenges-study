/*
  2257 - MinusOne
  -------
  by Mustafo Faiz (@fayzzzm) #medium #math

  ### Question

  Given a number (always positive) as a type. Your type should return the number decreased by one.

  For example:

  ```ts
  type Zero = MinusOne<1> // 0
  type FiftyFour = MinusOne<55> // 54
  ```

  > View on GitHub: https://tsch.js.org/2257
*/

/* _____________ Your Code Here _____________ */

// 리터럴로 변경 -> 마지막 단위에서 -1 처리 -> 0일 경우 앞 문자로 넘어오며 재귀함수 처리 -> 이 방식이 가능할까?

// 한 자리 수의 마이너스 1 처리용 타입
type CalcMinusOne = {
  [key: string]: string;
  "1": "0";
  "2": "1";
  "3": "2";
  "4": "3";
  "5": "4";
  "6": "5";
  "7": "6";
  "8": "7";
  "9": "8";
  "0": "9";
};

// 문자열 배열(튜플)의 마지막 요소 추출
type Last<T extends string[]> = T extends [...infer _, infer Last]
  ? Last
  : never;

// 문자열을 튜플로 변환
type StringToTuple<S extends String> = S extends `${infer First}${infer Last}`
  ? [First, ...StringToTuple<Last>]
  : [];

// 튜플을 문자열로 변환
type Join<T extends string[]> = T extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? `${First}${Join<Rest>}`
  : "";

// 마지막 요소를 제거한 튜플을 문자열로 변환
type RemoveLast<T extends string[]> = T extends [
  ...infer Rest extends string[],
  infer _,
]
  ? Join<Rest>
  : "";

// 문자열을 숫자로 변환
type StringToNumber<S extends string> = S extends `${infer N extends number}`
  ? N
  : never;

// 문자열 배열(튜플)의 마지막 요소가 0인 경우, 마지막 요소를 제거한 문자열 배열(튜플)을 문자열로 변환
// 만약 마지막 요소가 0이면 9로 변환, 그리고 앞 요소에 대해서도 재귀 돌리기
type MinusOneInStringArray<
  S extends string,
  ST extends string[] = StringToTuple<S>,
> =
  Last<ST> extends "0"
    ? S extends "10"
      ? "9"
      : `${MinusOneInStringArray<RemoveLast<ST>>}9`
    : Last<ST> extends "_"
      ? `${MinusOneInStringArray<RemoveLast<ST>>}_`
      : `${RemoveLast<ST>}${CalcMinusOne[Last<ST>]}`;

// 재귀 돌리기 전처리
type MinusOne<T extends number, S extends string[] = StringToTuple<`${T}`>> =
  Last<S> extends "0"
    ? StringToNumber<`${MinusOneInStringArray<RemoveLast<S>>}9`>
    : StringToNumber<`${RemoveLast<S>}${CalcMinusOne[Last<S>]}`>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<MinusOne<1>, 0>>,
  Expect<Equal<MinusOne<55>, 54>>,
  Expect<Equal<MinusOne<3>, 2>>,
  Expect<Equal<MinusOne<100>, 99>>,
  Expect<Equal<MinusOne<1101>, 1100>>,
  Expect<Equal<MinusOne<9_007_199_254_740_992>, 9_007_199_254_740_991>>,
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/2257/answer
  > View solutions: https://tsch.js.org/2257/solutions
  > More Challenges: https://tsch.js.org
*/
