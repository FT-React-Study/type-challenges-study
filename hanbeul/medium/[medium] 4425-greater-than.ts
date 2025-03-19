/*
  4425 - Greater Than
  -------
  by ch3cknull (@ch3cknull) #medium #array

  ### Question

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

  > View on GitHub: https://tsch.js.org/4425
*/

/* _____________ Your Code Here _____________ */

// 맨처음 같은지 확인부터 해주면 편할듯
// 일단 string으로 바꿔서, 자릿수 비교, 자릿수가 같다면 맨 앞글자에서부터 확인
type StringToTuple<S extends String> = S extends `${infer First}${infer Last}`
  ? [First, ...StringToTuple<Last>]
  : [];

// N 크기의 unknown[] 생성
type BuildArray<
  N extends number,
  Arr extends unknown[] = []
> = Arr["length"] extends N ? Arr : BuildArray<N, [...Arr, unknown]>;

// T가 U 이상인지 확인(같거나 더 클 경우)
type CompareDigit<T extends number, U extends number> = BuildArray<T> extends [
  ...BuildArray<U>,
  ...infer Rest
]
  ? true
  : false;

// 맨 앞의 0을 날려줘야 함
type StringToNumber<S extends string> =
  S extends `${"0"}${infer Rest extends number}`
    ? Rest
    : S extends `${infer N extends number}`
    ? N
    : never;

// string[]을 합쳐 string으로 변환
type Join<T extends string[]> = T extends [
  infer First extends string,
  ...infer Rest extends string[]
]
  ? `${First}${Join<Rest>}`
  : "";

type GreaterThan<
  T extends number,
  U extends number,
  TupleT extends string[] = StringToTuple<`${T}`>,
  TupleU extends string[] = StringToTuple<`${U}`>
> =
  // 같은 값인지 비교
  T extends U
    ? false
    : // 두 숫자의 자릿수가 같은지 비교
    TupleT["length"] extends TupleU["length"]
    ? TupleT["length"] extends 1
      ? // 자릿수가 모두 1일 경우, 한자리수 비교
        CompareDigit<T, U>
      : // 실제 앞에서부터 한글자씩 비교 로직
      TupleT extends [
          infer TFirst extends string,
          ...infer TRest extends string[]
        ]
      ? TupleU extends [
          infer UFirst extends string,
          ...infer URest extends string[]
        ]
        ? TFirst extends UFirst
          ? GreaterThan<
              StringToNumber<Join<TRest>>,
              StringToNumber<Join<URest>>
            >
          : CompareDigit<StringToNumber<TFirst>, StringToNumber<UFirst>>
        : true
      : false
    : // 자릿수가 다를 경우, length들끼리 비교
      CompareDigit<TupleT["length"], TupleU["length"]>;

// type example = GreaterThan<1234567891011, 1234567891010>;
// type example = GreaterThan<1011, 1010>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<GreaterThan<1, 0>, true>>,
  Expect<Equal<GreaterThan<5, 4>, true>>,
  Expect<Equal<GreaterThan<4, 5>, false>>,
  Expect<Equal<GreaterThan<0, 0>, false>>,
  Expect<Equal<GreaterThan<10, 9>, true>>,
  Expect<Equal<GreaterThan<20, 20>, false>>,
  Expect<Equal<GreaterThan<10, 100>, false>>,
  Expect<Equal<GreaterThan<111, 11>, true>>,
  Expect<Equal<GreaterThan<1234567891011, 1234567891010>, true>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/4425/answer
  > View solutions: https://tsch.js.org/4425/solutions
  > More Challenges: https://tsch.js.org
*/
