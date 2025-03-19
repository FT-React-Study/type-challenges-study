# Week 11

## [Medium-4179-Flip](./medium/4179-flip.ts)

```ts
type Flip<T extends Record<any, any>> = {
  [K in keyof T as T[K] extends keyof any ? T[K] : `${T[K]}`]: K;
};
```

- Object의 key-value를 value-key로 바꾸는 문제
- `No need to support nested objects and values which cannot be object keys such as arrays`
- 문제에 따라 중첩 객체에 대해서, value가 배열인 경우는 고려하지 않는다.
- value가 배열인 경우는 제외하지만 숫자형, 불리언이 존재할 수 있어 그 경우에 대한 처리가 필요하다.
- `Record<any, any>`로 기본적으로 T는 객체로 제한한다.
- `as T[K]`를 이용하여, `PropertyKey`로 쓰일 수 있는 value라면 그대로, 아니라면 템플릿 리터럴로 변환한다.

## [Medium-4182-FibonacciSequence](./medium/4182-fibonacci-sequence.ts)

- 최초 접근 방식
- 피보나치 수열의 기본적인 정의와 타입스크립트에서 숫자를 다루기 위한 `Array['length']`를 이용하여 접근한 방법
- 이는 재귀 깊이 제한으로 타입 시스템만으로는 구현될 수 없음

```ts
type Pop<T extends readonly any[]> = T extends [...infer F, infer _] ? F : [];

type NumberToUnknownArray<
  T extends number,
  ArrResult extends unknown[] = []
> = ArrResult["length"] extends T
  ? ArrResult
  : NumberToUnknownArray<T, [...ArrResult, unknown]>;

type Plus<A extends number, B extends number> = [
  ...NumberToUnknownArray<A>,
  ...NumberToUnknownArray<B>
]["length"];

type Fibonacci<T extends number> = T extends 0
  ? 0
  : T extends 1
  ? 1
  : Plus<
      Fibonacci<Pop<NumberToUnknownArray<T>>["length"]>,
      Fibonacci<Pop<Pop<NumberToUnknownArray<T>>["length"]>>
    >;
```

```ts
type Fibonacci<
  T extends number,
  FibonacciStep extends unknown[] = [1],
  FMinus1 extends unknown[] = [1],
  FMinus2 extends unknown[] = []
> = FibonacciStep["length"] extends T
  ? FMinus1["length"]
  : Fibonacci<T, [...FibonacciStep, 1], [...FMinus1, ...FMinus2], FMinus1>;
```

- 위의 이중 재귀 방식은 재귀 깊이 제한으로 인해 타입 시스템만으로는 구현될 수 없었음
- 이 방식은 일종의 반복문으로 이해할 수 있음
- 추가 제너릭을 이용하여 `FibonacciStep`에서 `F(n)`을 단계적으로 계산하고
- `FMinus1`과 `FMinus2`를 이용하여 `F(n - 1)`과 `F(n - 2)`를 계산하여 단계별로 처리하도록 함
- 단, 계산의 시작 지점에서 `F(N - 1)`, `F(N - 2)` 역할을 하며, 다음 단계로 넘어가는 `falsy condition`에서는 `F(N)`, `F(N - 1)`이 되어 다음 단계의 `F(N - 1)`, `F(N - 2)` 역할을 하게 된다.
- 즉, 최종적으로 `Step`이 T에 도달하게 되면 `FMinus1`은 구하고자 했던 `F(N)`이 된다.

## [Medium-4260-Nomiwase](./medium/4260-nomiwase.ts)

- 문자열 S를 나눠 만들 수 있는 모든 조합 + 빈 문자열의 유니언을 반환하는 문제

```ts
type StringToUnion<S extends string> = S extends `${infer F}${infer R}`
  ? F | StringToUnion<R>
  : never;
```

- 문자열을 나눠 유니언으로 변환하는 `StringToUnion` 타입을 이용한다

```ts
type AllCombinations<S extends string, U extends string = StringToUnion<S>> = [
  U
] extends [never]
  ? ""
  : "" | { [K in U]: `${K}${AllCombinations<never, Exclude<U, K>>}` }[U];
```

- `[U] extends [never]`를 재귀 종료 조건으로 설정한다 (TS 분배에서의 never 처리 방식)
- `U`가 처음에 `never`로 평가됨은 빈 문자열인 경우이므로 빈 문자열만을 반환한다
- 아닌 경우 분배된 `U`에 생성가능한 조합이 추가된 문자열을 유니언에 더한다
- { [K in U]: `${K}${AllCombinations<never, Exclude<U, K>>}` }[U]는
- `K in U`로 U의 각 문자에 대해 Mapped Type 객체를 생성
- 이 객체는 "AB"를 예로 들면 다음과 같이 생성됨
  - { A: "A" + AllCombinations<never, "B">, B: "B" + AllCombinations<never, "A"> }
  - 이를 Object[keyof Object]로 분배하면
  - "A" | "A" + AllCombinations<never, "B"> | "B" + AllCombinations<never, "A"> | "B"의 형태가 되고,
  - ""까지 포함한 유니언이 최종 결과가 된다.
- 각 K에 대해 현재 문자 K와 나머지 문자열로 가능한 모든 조합을 연결
- `Exclude<U, K>`는 유니언 중 현재 재귀 단계에서 처리대상인 K를 제외한 문자열

### Example (string: "AB")

1. StringToUnion<"AB"> = "A" | "B"
2. 분배된 A, B에 대해

- K = "A": "A" + AllCombinations<never, "B">
- K = "B": "B" + AllCombinations<never, "A">

2. 풀어보면

- "A" + ("" | "B") = "A" | "AB"
- "B" + ("" | "A") = "B" | "BA"

3. 결과: "" | "A" | "AB" | "B" | "BA"

## [Medium-4426-GreaterThan](./medium/4426-greater-than.ts)

- Array.length 메소드를 이용하여 숫자를 다루려 했으나 예제에 큰 수가 존재하여 이는 재귀깊이 제한이 걸린다
- 따라서, 앞서 사용한 적 있는 문자열로 변환하는 방식을 이용하여 풀이하기로 했다.

- 기본적인 방식은 다음처럼 접근했다.

1. 자릿수를 비교한다
2. 자릿수가 같다면 큰 자리수부터 차례로 비교를 진행한다
3. 비교 결과를 반환한다.

```ts
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
```

- `CompareStringLength`는 문자열의 길이를 비교한다.
- T와 U를 하나씩 끊어가며 남은 문자열의 길이에 기반하여 비교를 진행하며, T가 truthy인데 U가 falsy인 경우 (T가 더 긴 경우) true를 반환하는 방식이다.
- `CompareDigit`은 `DigitCompareMap`을 이용하여 각 자리수를 비교하며 T의 수가 key, U의 수가 value[index] 형태가 되어 보다 큰 수임을 판별하게 한다.
- `CompareDigitLoop`은 하나씩 끊어가며 `CompareDigit`을 호출하여 비교하는 방식이다
- 기본적으로, `TFirst extends UFirst`에서 두 수가 같다면 다음 루프로 넘어가고, 서로 다른 수라면
- `CompareDigit`에서 비교하여 T 쪽이 더 큰지 혹은 같거나 작은지로 true/false를 반환한다.
- `GreaterThan`은 이를 이용하여 1. 길이(자릿수) 비교 2. 높은 자리부터 순서대로 크기비교 를 진행하여 보다 큰 수를 판별한다.

## [Medium-4471-Zip](./medium/4471-zip.ts)

```ts
type Zip<T extends any[], U extends any[]> = T extends [
  infer THead,
  ...infer TRest
]
  ? U extends [infer UHead, ...infer URest]
    ? [[THead, UHead], ...Zip<TRest, URest>]
    : []
  : [];
```

- 두 배열이 주어지고, 각 배열의 원소를 하나씩 짝지어 배열로 만든다.
- 단, T와 U의 길이가 다를 때 짝지어지지 않는 원소는 제외된다.
- `infer` 키워드를 이용하여 각 배열을 앞에서부터 하나씩 끊어 짝으로 만들고 나머지는 재귀로 처리한다.
- 여기서 어느 쪽이든 원소의 수가 적은 경우 나머지는 빈 배열로 처리되어 나머지 긴 쪽의 원소는 제외된다.

## [Medium-4484-IsTuple](./medium/4484-is-tuple.ts)
