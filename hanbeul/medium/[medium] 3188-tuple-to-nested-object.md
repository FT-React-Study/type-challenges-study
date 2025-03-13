# 3188 - Tuple to Nested Object

## 문제

Given a tuple type `T` that only contains string type, and a type `U`, build an object recursively.

주어진 튜플 타입 `T` 가 문자열 타입만 포함하고 있고, 타입 `U` 가 주어졌을 때, 재귀적으로 객체를 만드세요.

> 예시

```typescript
type a = TupleToNestedObject<["a"], string>; // {a: string}
type b = TupleToNestedObject<["a", "b"], number>; // {a: {b: number}}
type c = TupleToNestedObject<[], boolean>; // boolean. if the tuple is empty, just return the U type
```

## 풀이

### 시도 1

> 접근 방식

- 먼저 빈 배열 처리
- 재귀로 튜플의 First와 Rest를 나눠서 First: {Rest: U} 이런 형태가 되도록 처리

> 코드

```typescript
type TupleToNestedObject<T extends any[], U> = T extends []
  ? U
  : T extends [infer First, ...infer Rest]
    ? {First: TupleToNestedObject<Rest, U>}
    : never;
]
```

> 실패 이유

- `{First: TupleToNestedObject<Rest, U>}`에서 사용된 `First`가 `infer`로 추론된 `First` 값이 아닌 문자열 `'First'`로 추론됨

### 시도 2 (정답)

> 접근 방식

- 문제 조건에 따라 string으로 키값 제어, K라는 변수로 First를 키값으로 받게 추가

> 코드

```typescript
type TupleToNestedObject<T extends string[], U> = T extends [
  infer First extends string,
  ...infer Rest extends string[]
]
  ? { [K in First]: TupleToNestedObject<Rest, U> }
  : U;
```

> 코드 설명

- `infer First extends string, ...infer Rest extends string[]` 형태로 튜플의 First와 Rest를 나눠서 재귀적으로 처리
- `[K in First]: TupleToNestedObject<Rest, U>` 형태로 키값을 First로 받고, 나머지 부분을 재귀적으로 처리
- 빈 튜플일 경우, U 타입을 그대로 반환
