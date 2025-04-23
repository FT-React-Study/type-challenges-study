## [medium] 18220. Filter

> View on github: https://tsch.js.org/18220

#### 문제

Implement the type `Filter<T, Predicate>` takes an Array `T`, primitive type or union primitive type `Predicate` and returns an Array include the elements of `Predicate`.

#### 문제 설명

- 배열을 받아, 배열의 요소중 Predicate(`Primitive Type` or `Union Primitive Type`)에 해당하는 요소만 반환

#### 시도 1

> 접근 방식

- 배열을 순회하면서 각 요소가 P에 extends 되는지 확인
- 해당 요소가 P에 extends 되면 리턴 배열에 포함

> 코드

```ts
type Filter<T extends any[], P> = T extends [infer First, ...infer Rest]
  ? First extends P
    ? [First, ...Filter<Rest, P>]
    : [...Filter<Rest, P>]
  : [];
```

> 코드 설명

- 배열을 순회하면서 각 요소가 P에 extends 되는지 확인
- 해당 요소가 P에 extends 되면 리턴 배열에 포함
- 해당 요소가 P에 extends 되지 않으면 무시
- 전체 순회가 끝나면 빈 배열 반환
