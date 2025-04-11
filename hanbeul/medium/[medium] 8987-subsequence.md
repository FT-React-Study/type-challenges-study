## [medium] 8987. Subsequence

#### 문제

> View on GitHub: https://tsch.js.org/8987

A subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements.

> 예시

```typescript
type A = Subsequence<[1, 2]>; // [] | [1] | [2] | [1, 2]
```

#### 문제 설명

- 배열을 받아, 모든 부분 수열을 반환

#### 시도 1

> 접근 방식

- 기존 콤비네이션 코드 활용
- 튜플을 유니온으로 만든 뒤, 각 요소로 콤비네이션 만들어서 리턴?

> 코드

```ts
type Combination<A extends string, B extends string> = [A] | [B] | [A, B];

type UnionCombination<A extends string, B extends string = A> = A extends B
  ? Combination<A, UnionCombination<Exclude<B, A>>>
  : never;

type Subsequence<T extends any[]> = UnionCombination<T[number]>;
```

> 실패 이유

- 콤비네이션으로 구현할 수 없음

#### 시도 2 (답지 참고)

> 접근 방식

- 순회 + Exclude 대신 재귀로 구현

> 코드

```ts
type Subsequence<T extends any[]> = T extends [infer First, ...infer Rest]
  ? Subsequence<Rest> | [First, ...Subsequence<Rest>]
  : [];
```

> 코드 설명

- 배열을 순회하며, 각 요소를 추출
- 1. 해당 요소와 나머지의 부분으로 만든 부분 수열과
- 2. 해당 요소를 제외한 나머지의 부분으로 만든 부분 수열을 합쳐 유니온으로 리턴
- `First`가 없을 경우(빈 배열일 경우) 빈 배열 리턴
