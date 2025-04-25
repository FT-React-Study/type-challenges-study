## [medium] 25170. Replace First

> View on github: https://tsch.js.org/25170

#### 문제

Implement the type `ReplaceFirst<T, S, R>` which will replace the first occurrence of `S` in a tuple `T` with `R`. If no such `S` exists in `T`, the result should be `T`.

#### 문제 설명

- 튜플 `T`에서 첫 번째로 나타나는 `S`를 `R`로 대체
- 만약 `T`에 `S`가 없다면, 결과는 `T`

#### 시도 1 (정답)

> 접근 방식

- 튜플을 순회하면서, `S`와 같은 요소를 찾아서 `R`로 대체

> 코드

```ts
type ReplaceFirst<
  T extends readonly unknown[],
  S,
  R,
  Result extends any[] = []
> = T extends [infer First, ...infer Rest]
  ? First extends S
    ? [...Result, R, ...Rest]
    : ReplaceFirst<Rest, S, R, [...Result, First]>
  : Result;
```

> 코드 설명

- 튜플을 순회하면서, `S`와 같은 요소를 찾음 (`extends`로 비교, `IsEqual`로 비교시 `two`와 `string` 비교 안됨)
- 찾으면, `R`로 대체
- 대체 후 나머지 요소들을 리턴
