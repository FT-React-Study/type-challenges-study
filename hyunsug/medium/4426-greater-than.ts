type NumberToString<T extends number> = `${T}`;

type CompareStringLength<
  T extends string,
  U extends string
> = T extends `${infer _}${infer TRest}`
  ? U extends `${infer _}${infer URest}`
    ? CompareStringLength<TRest, URest>
    : "greater" // U가 먼저 끝나면 T가 더 큰 것으로 간주
  : U extends `${infer _}${infer _}`
  ? "less" // T가 먼저 끝나면 T는 더 작음
  : "same";

type DigitCompareMap = {
  "0": [false, false, false, false, false, false, false, false, false, false];
  "1": [true, false, false, false, false, false, false, false, false, false];
  "2": [true, true, false, false, false, false, false, false, false, false];
  "3": [true, true, true, false, false, false, false, false, false, false];
  "4": [true, true, true, true, false, false, false, false, false, false];
  "5": [true, true, true, true, true, false, false, false, false, false];
  "6": [true, true, true, true, true, true, false, false, false, false];
  "7": [true, true, true, true, true, true, true, false, false, false];
  "8": [true, true, true, true, true, true, true, true, false, false];
  "9": [true, true, true, true, true, true, true, true, true, false];
};

type CompareDigit<
  T extends string,
  U extends string
> = T extends keyof DigitCompareMap
  ? U extends keyof DigitCompareMap
    ? DigitCompareMap[T][U]
    : never
  : never;

type CompareDigitLoop<
  T extends string,
  U extends string
> = T extends `${infer TFirst}${infer TRest}`
  ? U extends `${infer UFirst}${infer URest}`
    ? TFirst extends UFirst
      ? CompareDigitLoop<TRest, URest>
      : CompareDigit<TFirst, UFirst>
    : true // U가 먼저 끝나면 T가 더 큰 것으로 간주
  : false; // T가 먼저 끝나면 T는 더 작음

type GreaterThan<T extends number, U extends number> = CompareStringLength<
  NumberToString<T>,
  NumberToString<U>
> extends "greater"
  ? true
  : CompareStringLength<NumberToString<T>, NumberToString<U>> extends "less"
  ? false
  : CompareDigitLoop<NumberToString<T>, NumberToString<U>>;

type test = GreaterThan<1, 0>;
