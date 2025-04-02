## [medium] 5310. Join

> View on GitHub: https://tsch.js.org/5310

#### 문제

Implement the type version of Array.join, Join<T, U> takes an Array T, string or number U and returns the Array T with U stitching up.

```ts
type Res = Join<["a", "p", "p", "l", "e"], "-">; // expected to be 'a-p-p-l-e'
type Res1 = Join<["Hello", "World"], " ">; // expected to be 'Hello World'
type Res2 = Join<["2", "2", "2"], 1>; // expected to be '21212'
type Res3 = Join<["o"], "u">; // expected to be 'o'
```

#### 문제 설명

- `Array.join()` 메서드를 타입 레벨에서 구현
- 배열 `T`와 문자열 또는 숫자 `U`를 받아서 배열 `T`의 요소를 `U`로 구분하여 문자열로 반환

#### 제한 사항

- 배열 `T`의 요소 타입은 문자열 또는 숫자
- `U`는 문자열 또는 숫자

#### 시도 1

> 접근 방법

- 배열에서 하나씩 순회하면서, 마지막만 아니면 U 끼워넣어서 리턴하기

> 코드

```ts
type Join<
  T extends (string | number)[],
  U extends string | number
> = T extends [
  infer First extends string | number,
  ...infer Rest extends (string | number)[]
]
  ? T["length"] extends 1
    ? `${First}`
    : `${First}${U}${Join<Rest, U>}`
  : "";
```

> 실패 원인

- U가 존재하지 않는 경우 존재

#### 시도 2 (정답)

> 접근 방법

- `U`가 존재하지 않으면 기본값으로 `,` 추가

> 코드

```ts
type Join<
  T extends (string | number)[],
  U extends string | number = ","
> = T extends [
  infer First extends string | number,
  ...infer Rest extends (string | number)[]
]
  ? T["length"] extends 1
    ? `${First}`
    : `${First}${U}${Join<Rest, U>}`
  : "";
```

> 코드 설명

- `T`를 infer로 분리하여 첫번째 요소와 나머지 요소로 분리
- `T["length"]`가 1이면 마지막 요소이기 때문에, 그냥 반환
- 아닐 경우, 첫번째 요소와 `U`를 묶어서 재귀 호출
