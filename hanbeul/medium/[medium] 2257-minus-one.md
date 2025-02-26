# 2257 - Minus One

## 문제

주어진 숫자(항상 양수) 타입을 받아 1을 빼는 `MinusOne<T>`를 구현하세요. 반환 타입은 숫자 타입이어야 합니다.

> 예시

```ts
type Zero = MinusOne<1>; // 0
type FiftyFour = MinusOne<55>; // 54
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- 받은 숫자를 리터럴로 변경 후, 마지막 자리에서 -1 처리
- 마지막 자리가 0일 경우, 앞 문자로 넘어오며 재귀 돌리기

> 코드

```ts
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
```

> 코드 설명

- 1978-PercentageParser 문제에서 작성한 함수들 활용
- `CalcMinusOne` 타입: 한 자리 수의 마이너스 1 처리용 타입
- `StringToTuple<S>`: 문자열을 튜플로 변환
- `Join<T extends string[]>`: 튜플을 문자열로 변환
- `RemoveLast<T extends string[]>`: 튜플의 마지막 요소를 제거하여 문자열로 조인해서 반환
- `StringToNumber<S extends string>`: 문자열을 숫자로 변환
- `Last<T extends string[]>`: 튜플의 마지막 요소 추출
- `MinusOneInStringArray<S>`: 문자열 배열(튜플)의 마지막 요소가 0인 경우, 마지막 요소를 제거한 문자열 배열(튜플)을 문자열로 변환
- `MinusOne<T>`: 재귀 돌리기, 최초 조건부 처리
