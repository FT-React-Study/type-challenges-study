# 459 - Flatten

> View on GitHub: https://tsch.js.org/459

## 문제

주어진 배열을 플랫한 배열 타입으로 바꾸는 Flatten 타입을 구현하세요.

## 문제 설명

- 배열 타입을 플랫하게 만들어 반환하는 문제
- 배열 안의 배열까지 처리해야 됨
- 배열이 아닌 경우 에러 처리

## 정답

```ts
type Flatten<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : [];
```

## 설명

- 제네릭 `T`에 `extends any[]`를 활용해, 배열이 아닌 경우 에러 처리
- `[infer First, ...infer Rest]`로 배열의 각 요소 확인
- `First`가 배열인 경우, `[...Flatten<First>, ...Flatten<Rest>]`로 재귀 호출
- `First`가 배열이 아닌 경우, `[First, ...Flatten<Rest>]`로 재귀 호출

## 오답노트

> 1차 시도

```ts
type Flatten<T> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : [];
```

- 에러 처리를 빼먹음
- 제네릭 T에 extends any[]를 활용해, 배열이 아닌 경우 에러 처리
