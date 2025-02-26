# 1978 Percentage Parser

## 문제

PercentageParser을 구현하세요. `/^(\+|\-)?(\d*)?(\%)?$/` 정규식에 따라 T를 일치시키고 3개의 일치 요소를 얻습니다
구조는 [`더하기 혹은 빼기`, `숫자`,`단위`]와 같아야 합니다.
일치 요소가 없다면, 기본값은 빈 문자열입니다.

> 예시

```ts
type PString1 = "";
type PString2 = "+85%";
type PString3 = "-85%";
type PString4 = "85%";
type PString5 = "85";

type R1 = PercentageParser<PString1>; // expected ['', '', '']
type R2 = PercentageParser<PString2>; // expected ["+", "85", "%"]
type R3 = PercentageParser<PString3>; // expected ["-", "85", "%"]
type R4 = PercentageParser<PString4>; // expected ["", "85", "%"]
type R5 = PercentageParser<PString5>; // expected ["", "85", ""]
```

## 풀이

### 시도 1

> 접근 방식

- 맨 앞, 중간 부분, 맨 뒤를 잘라서 확인해보자

> 코드

```ts
type IsSign<C extends string> = C extends "+" | "-" ? true : false;
type IsPercent<C extends string> = C extends "%" ? true : false;
type PercentageParser<A extends string> =
  A extends `${infer First}${infer Middle}${infer Last}`
    ? IsSign<First> extends true
      ? IsPercent<Last> extends true
        ? [First, Middle, Last]
        : [First, `${Middle}${Last}`, ""]
      : IsPercent<Last> extends true
        ? ["", `${First}${Middle}`, Last]
        : ["", `${First}${Middle}${Last}`, ""]
    : ["", "", ""];
```

> 실패 이유

- 중간 부분 분리를 못함

### 시도 2 (정답)

> 접근 방식

- 입력받은 string을 튜플로 바꿔서 확인

> 코드

```ts
type IsSign<C extends string> = C extends "+" | "-" ? true : false;
type IsPercent<C extends string> = C extends "%" ? true : false;

type Last<T extends any[]> = T extends [...infer _, infer Last extends string]
  ? Last
  : "";

type Join<T extends string[]> = T extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? `${First}${Join<Rest>}`
  : "";

type RemoveLast<T extends string[]> = T extends [
  ...infer Rest extends string[],
  infer _,
]
  ? Join<Rest>
  : "";

type StringToTuple<S extends String> = S extends `${infer First}${infer Last}`
  ? [First, ...StringToTuple<Last>]
  : [];

type PercentageParser<A extends string> =
  StringToTuple<A> extends [
    infer First extends string,
    ...infer Rest extends string[],
  ]
    ? IsSign<First> extends true
      ? IsPercent<Last<Rest>> extends true
        ? [First, RemoveLast<Rest>, Last<Rest>]
        : [First, Join<Rest>, ""]
      : IsPercent<First> extends true
        ? ["", "", "%"]
        : IsPercent<Last<Rest>> extends true
          ? ["", RemoveLast<[First, ...Rest]>, Last<Rest>]
          : ["", Join<[First, ...Rest]>, ""]
    : ["", "", ""];
```

> 코드 설명

- `IsSign<C extends string>`: 한 글자(Character)를 받아 해당 요소가 부호(+, -)인지 확인
- `IsPercent<C extends string>`: 한 글자(Character)를 받아 해당 요소가 단위(%)인지 확인
- `Last<T extends any[]>`: 배열을 받아 마지막 요소를 반환
- `Join<T extends string[]>`: 배열을 받아 문자열로 결합
- `RemoveLast<T extends string[]>`: 배열을 받아 마지막 요소를 제거
- `StringToTuple<S extends string>`: 문자열을 받아 튜플로 변환
- 문자열을 받아 튜플로 변환한 후, 튜플의 첫 번째 요소가 부호인지 확인
- 이후 튜플의 마지막 요소가 퍼센트인지 확인
- 각 조건에 맞게 튜플을 문자열로 결합하여 반환
