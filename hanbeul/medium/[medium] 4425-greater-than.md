## [medium] 4425. Greater Than

#### 문제

이 챌린지에서는 T > U와 같은 GreaterThan<T, U> 타입을 구현해야 합니다.
음수는 고려하지 않아도 됩니다.

> 예시

```ts
GreaterThan<2, 1>; //true가 되어야 함
GreaterThan<1, 1>; //false가 되어야 함
GreaterThan<10, 100>; //false가 되어야 함
GreaterThan<111, 11>; //true가 되어야 함
```

#### 시도 1 (정답)

> 접근 방법

- 두 숫자를 문자열로 변환하여 자릿수 비교
- 자릿수가 같다면 맨 앞글자에서부터 확인
- 자릿수가 다르다면 자릿수 비교

> 코드

```ts
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
```

> 코드 설명

- 같은 값일 경우 false 리턴
- 이후 두 숫자의 자릿수가 같은지 비교
- 자릿수가 같고 한자리수일 경우, 두 숫자를 비교하여 결과 리턴
- 자릿수가 같고 한자리수가 아닐 경우, 재귀로 비교(앞의 한 자리씩)
- 자릿수가 다를 경우, 각 자릿수를 비교하여 결과 리턴

- `StringToTuple` 함수는 문자열을 튜플로 변환
- `BuildArray` 함수는 숫자에 따라 그 길이만큼의 unknown[] 타입을 생성
- `CompareDigit` 함수는 두 숫자를 비교하여 결과 리턴
- `StringToNumber` 함수는 문자열을 숫자로 변환
- `Join` 함수는 튜플을 문자열로 변환
