# 3243 - FlattenDepth

## 문제

배열을 주어진 깊이까지 재귀적으로 평탄화하는 타입을 구현하세요.

> 예시

```typescript
type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>; // [1, 2, 3, 4, [5]]. flattern 2 times
type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]>; // [1, 2, 3, 4, [[5]]]. Depth defaults to be 1
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- 기존 코드 활용(2257-minus-one, 459-flatten)
- N이 0이 될 때까지 flatten 함수를 재귀적으로 호출
- flatten은 459-flatten과 다르게 1회만 실행하도록 처리

> 코드

```typescript
/* _____________ 기존 코드 활용 _____________ */

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

type FlattenDepth<T extends any[], N extends number = 1> = N extends 0
  ? T
  : FlattenDepth<Flatten<T>, MinusOne<N>>;
```

> 실패 이유

- 재귀 호출 횟수가 너무 많아서 런타임 오류 발생
- 재귀 호출 횟수를 제한하는 방법을 찾아야 함

### 시도 2 (정답)

> 접근 방식

- 만약 이미 flatten된 배열이면 depth가 남았어도 재귀 끝내기

> 코드

```typescript
type FlattenDepth<T extends any[], N extends number = 1> = N extends 0
  ? T
  : T extends (string | number | symbol)[]
  ? T
  : FlattenDepth<Flatten<T>, MinusOne<N>>;
```

> 코드 설명

- `N extends 0` 형태로 N이 0이 될 때까지 재귀 호출
- `T extends (string | number | symbol)[]` 형태로 이미 flatten된 배열인 경우 재귀 끝내기
- `FlattenDepth<Flatten<T>, MinusOne<N>>` 형태로 flatten 함수를 재귀적으로 호출
