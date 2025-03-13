/*
  3243 - FlattenDepth
  -------
  by jiangshan (@jiangshanmeta) #medium #array

  ### Question

  Recursively flatten array up to depth times.

  For example:

  ```typescript
  type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2> // [1, 2, 3, 4, [5]]. flattern 2 times
  type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, [[5]]]. Depth defaults to be 1
  ```

  If the depth is provided, it's guaranteed to be positive integer.

  > View on GitHub: https://tsch.js.org/3243
*/

/* ------------- 기존 코드 활용 --------------- */

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
  ...infer Rest extends string[]
]
  ? `${First}${Join<Rest>}`
  : "";

// 마지막 요소를 제거한 튜플을 문자열로 변환
type RemoveLast<T extends string[]> = T extends [
  ...infer Rest extends string[],
  infer _
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
  ST extends string[] = StringToTuple<S>
> = Last<ST> extends "0"
  ? S extends "10"
    ? "9"
    : `${MinusOneInStringArray<RemoveLast<ST>>}9`
  : Last<ST> extends "_"
  ? `${MinusOneInStringArray<RemoveLast<ST>>}_`
  : `${RemoveLast<ST>}${CalcMinusOne[Last<ST>]}`;

// 재귀 돌리기 전처리
type MinusOne<
  T extends number,
  S extends string[] = StringToTuple<`${T}`>
> = Last<S> extends "0"
  ? StringToNumber<`${MinusOneInStringArray<RemoveLast<S>>}9`>
  : StringToNumber<`${RemoveLast<S>}${CalcMinusOne[Last<S>]}`>;

// Flatten 함수(1회만 실행하는)
type Flatten<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...First, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : [];

/* _____________ Your Code Here _____________ */

// 기존 minusone과 flatten 섞어서 재귀돌리면 되지 않을까
// type FlattenDepth<T extends any[], N extends number = 1> = N extends 0 ? T : FlattenDepth<Flatten<T>, MinusOne<N>>;

// 19260817만큼 재귀가 돌아가지 않음.
// 이미 flatten이면 재귀 끝내버리기
type FlattenDepth<T extends any[], N extends number = 1> = N extends 0
  ? T
  : T extends (string | number | symbol)[]
  ? T
  : FlattenDepth<Flatten<T>, MinusOne<N>>;

type example = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<FlattenDepth<[]>, []>>,
  Expect<Equal<FlattenDepth<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<FlattenDepth<[1, [2]]>, [1, 2]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>, [1, 2, 3, 4, [5]]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, [[5]]]>>,
  Expect<Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 3>, [1, 2, 3, 4, [5]]>>,
  Expect<
    Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 19260817>, [1, 2, 3, 4, 5]>
  >
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/3243/answer
  > View solutions: https://tsch.js.org/3243/solutions
  > More Challenges: https://tsch.js.org
*/
