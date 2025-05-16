## [medium] 27862. Cartesian Product

> View on GitHub: https://tsch.js.org/27862

#### 문제

Given 2 sets (unions), return its Cartesian product in a set of tuples.

> 예시

```ts
CartesianProduct<1 | 2, "a" | "b">;
// [1, 'a'] | [2, 'a'] | [1, 'b'] | [2, 'b']
```

#### 문제 설명

- 두 개의 집합을 받아 카티시안 곱을 반환하는 문제

#### 시도 1

> 접근 방식

- 두 개의 집합을 전체 순회하며 튜플 형태로 반환

> 코드

```ts
type CartesianProduct<T, U, TT = T, UU = U> = T extends TT
  ? U extends UU
    ? [T, U]
    : never
  : never;
```

> 코드 설명

- `T extends TT` : `T`의 요소를 하나씩 순회
- `U extends UU` : `U`의 요소를 하나씩 순회
- `[T, U]` : 튜플 형태로 반환
- 순회해서 생긴 튜플들은 `|`로 구분되어 반환됨
