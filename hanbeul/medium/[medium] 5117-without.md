## [medium] 5117. Without

#### 문제

Lodash의 without 함수를 타입 버전으로 구현하세요. `Without<T, U>`는 배열 `T`와 숫자 또는 배열 `U`를 받아서 `U`의 요소들을 제외한 배열을 반환합니다.

> 예시

```ts
type Res = Without<[1, 2], 1>; // expected to be [2]
type Res1 = Without<[1, 2, 4, 1, 5], [1, 2]>; // expected to be [4, 5]
type Res2 = Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]>; // expected to be []
```

> 문제 설명

- 배열 `T`와 숫자 또는 배열 `U`를 받아서 `U`의 요소들을 제외한 배열을 반환
- `U`는 숫자 또는 배열이 들어올 수 있음

#### 시도 1 (정답)

> 접근 방법

- 배열 `T`를 재귀적으로 탐색하면서 `U`의 요소들을 제외한 배열을 반환

> 코드

```ts
type TupleToUnion<T extends readonly number[] | number> = T extends number[]
  ? T[number]
  : T;

type Without<T extends any[], U extends number | number[]> = T extends [
  infer First,
  ...infer Rest
]
  ? First extends TupleToUnion<U>
    ? [...Without<Rest, U>]
    : [First, ...Without<Rest, U>]
  : T;
```

> 코드 설명

- `TupleToUnion<U>`는 `U`가 튜플일 경우 유니온 타입으로 변환
- `Without<T, U>`는 배열 `T`를 재귀적으로 탐색하면서 `U`의 요소들을 제외한 배열을 반환
