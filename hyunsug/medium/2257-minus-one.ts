// Given a number (always positive) as a type. Your type should return the number decreased by one.

// type BuildTuple<
//   N extends number,
//   T extends unknown[] = []
// > = T["length"] extends N ? T : BuildTuple<N, [...T, unknown]>;

// type MinusOne<N extends number> = BuildTuple<N> extends [...infer R, unknown]
//   ? R["length"]
//   : never;
type DigitMinusMap = {
  "0": "9";
  "1": "0";
  "2": "1";
  "3": "2";
  "4": "3";
  "5": "4";
  "6": "5";
  "7": "6";
  "8": "7";
  "9": "8";
};

// 문자열을 뒤집는 타입
type Reverse<S extends string> = S extends `${infer F}${infer R}`
  ? `${Reverse<R>}${F}`
  : "";

// 뒤집힌 문자열에서 1을 빼는 타입 (뒤에서부터 처리)
type MinusOneReversed<
  S extends string,
  Borrow extends boolean = false
> = S extends `${infer F}${infer R}`
  ? F extends "0"
    ? Borrow extends true
      ? `9${MinusOneReversed<R, true>}` // 0에서 1을 빼면 9가 되고 자리 내림이 발생하므로 다음 자리도 처리
      : `9${R}` // 0에서 1을 빼면 9가 되고, 자리 내림이 없는 경우 나머지 문자열 그대로 반환
    : F extends keyof DigitMinusMap
    ? Borrow extends true
      ? `${DigitMinusMap[F]}${R}` // 자리 내림이 있는 경우, 현재 숫자에서 1을 빼고 나머지 문자열 그대로 반환
      : `${DigitMinusMap[F]}${R}` // 자리 내림이 없는 경우도 동일하게 처리 (이 부분은 중복된 로직)
    : never // F가 숫자가 아닌 경우 (발생하지 않음)
  : ""; // 문자열이 비어있는 경우 빈 문자열 반환

// 앞의 0을 제거하는 타입
type RemoveLeadingZeros<S extends string> = S extends "0"
  ? "0"
  : S extends `0${infer R}`
  ? RemoveLeadingZeros<R>
  : S;

// 숫자에서 1을 빼는 최종 타입
type MinusOne<N extends number> = `${N}` extends "0"
  ? -1
  : `${N}` extends "1"
  ? 0
  : ParseInt<
      RemoveLeadingZeros<Reverse<MinusOneReversed<Reverse<`${N}`>, true>>>
    >;

// 문자열을 숫자로 변환하는 타입
type ParseInt<S extends string> = S extends `${infer N extends number}`
  ? N
  : never;

type Zero = MinusOne<1>; // 0
type FiftyFour = MinusOne<55>; // 54

type MinusTest = MinusOne<3>; // 2
type MinusTest2 = MinusOne<100>; // 99
type MinusTest3 = MinusOne<1101>; // 1100
type MinusTest4 = MinusOne<9_007_199_254_740_992>; // 9_007_199_254_740_991
