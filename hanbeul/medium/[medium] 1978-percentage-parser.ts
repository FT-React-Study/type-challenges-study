/*
  1978 - Percentage Parser
  -------
  by SSShuai1999 (@SSShuai1999) #보통 #template-literal

  ### 질문

  PercentageParser을 구현하세요. `/^(\+|\-)?(\d*)?(\%)?$/` 정규식에 따라 T를 일치시키고 3개의 일치 요소를 얻습니다
  구조는 [`더하기 혹은 빼기`, `숫자`,`단위`]와 같아야 합니다.
  일치 요소가 없다면, 기본값은 빈 문자열입니다.

  예시:

  ```ts
  type PString1 = ""
  type PString2 = "+85%"
  type PString3 = "-85%"
  type PString4 = "85%"
  type PString5 = "85"

  type R1 = PercentageParser<PString1> // expected ['', '', '']
  type R2 = PercentageParser<PString2> // expected ["+", "85", "%"]
  type R3 = PercentageParser<PString3> // expected ["-", "85", "%"]
  type R4 = PercentageParser<PString4> // expected ["", "85", "%"]
  type R5 = PercentageParser<PString5> // expected ["", "85", ""]
  ```

  > GitHub에서 보기: https://tsch.js.org/1978/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

// 시도 1
// 흠... 맨앞, 중간들, 맨뒤 잘라서 확인해보면 되지 않을까?
// 결론- 중간들 분리를 못함
// type IsSign<C extends string> = C extends '+' | '-' ? true : false;
// type IsPercent<C extends string> = C extends '%' ? true : false;
// type PercentageParser<A extends string> = A extends `${infer First}${infer Middle}${infer Last}`
//   ? IsSign<First> extends true
//     ? IsPercent<Last> extends true
//       ? [First, Middle, Last]
//       : [First, `${Middle}${Last}`, '']
//     : IsPercent<Last> extends true
//       ? ['', `${First}${Middle}`, Last]
//       : ['', `${First}${Middle}${Last}`, '']
//   : ['', '', '']

// 시도 2
// 입력받은 string을 튜플로 바꿔서 확인
// type IsSign<C extends string> = C extends '+' | '-' ? true : false;
// type IsPercent<C extends string> = C extends '%' ? true : false;

// type Last<T extends any[]> = T extends [...infer _, infer Last extends string] ? Last : '';

// type Join<T extends string[]> = T extends [infer First extends string, ...infer Rest extends string[]]
//   ? `${First}${Join<Rest>}`
//   : '';

// type RemoveLast<T extends string[]> = T extends [...infer Rest extends string[], infer _]
//     ? Join<Rest>
//     : '';

// type StringToTuple<S extends String> = S extends `${infer First}${infer Last}`
//   ? [First, ...StringToTuple<Last>]
//   : [];

// type PercentageParser<A extends string> = StringToTuple<A> extends [infer First extends string, ...infer Rest extends string[]]
//     ? IsSign<First> extends true
//       ? IsPercent<Last<Rest>> extends true
//         ? [First, RemoveLast<Rest>, Last<Rest>]
//         : [First, Join<Rest>, '']
//       : IsPercent<First> extends true
//         ? ['', '', '%']
//         : IsPercent<Last<Rest>> extends true
//           ? ['', RemoveLast<[First, ...Rest]>, Last<Rest>]
//           : ['', Join<[First, ...Rest]>, '']
//     : ['', '', ''];

// 시도2에서 정답은 맞췄으나... 이딴게 정답?
// 답지 확인
type CheckPrefix<T> = T extends "+" | "-" ? T : never;
type CheckSuffix<T> = T extends `${infer P}%` ? [P, "%"] : [T, ""];
type PercentageParser<A extends string> =
  A extends `${CheckPrefix<infer L>}${infer R}`
    ? [L, ...CheckSuffix<R>]
    : ["", ...CheckSuffix<A>];

// infer를 활용해 스트링 리터럴 확인하는거 쥑이네...(prefix)
// CheckSuffix처럼 활용하는거 머릿속에 잘 박아두기

type example = PercentageParser<"100%">;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type Case0 = ["", "", ""];
type Case1 = ["+", "", ""];
type Case2 = ["+", "1", ""];
type Case3 = ["+", "100", ""];
type Case4 = ["+", "100", "%"];
type Case5 = ["", "100", "%"];
type Case6 = ["-", "100", "%"];
type Case7 = ["-", "100", ""];
type Case8 = ["-", "1", ""];
type Case9 = ["", "", "%"];
type Case10 = ["", "1", ""];
type Case11 = ["", "100", ""];

type cases = [
  Expect<Equal<PercentageParser<"">, Case0>>,
  Expect<Equal<PercentageParser<"+">, Case1>>,
  Expect<Equal<PercentageParser<"+1">, Case2>>,
  Expect<Equal<PercentageParser<"+100">, Case3>>,
  Expect<Equal<PercentageParser<"+100%">, Case4>>,
  Expect<Equal<PercentageParser<"100%">, Case5>>,
  Expect<Equal<PercentageParser<"-100%">, Case6>>,
  Expect<Equal<PercentageParser<"-100">, Case7>>,
  Expect<Equal<PercentageParser<"-1">, Case8>>,
  Expect<Equal<PercentageParser<"%">, Case9>>,
  Expect<Equal<PercentageParser<"1">, Case10>>,
  Expect<Equal<PercentageParser<"100">, Case11>>,
];

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/1978/answer/ko
  > 정답 보기: https://tsch.js.org/1978/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
