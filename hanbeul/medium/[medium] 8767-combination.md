## [medium] 8767. Combination

> View on GitHub: https://tsch.js.org/8767

#### 문제

Given an array of strings, do Permutation & Combination.
It's also useful for the prop types like video [controlsList](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controlsList)

```ts
// expected to be `"foo" | "bar" | "baz" | "foo bar" | "foo bar baz" | "foo baz" | "foo baz bar" | "bar foo" | "bar foo baz" | "bar baz" | "bar baz foo" | "baz foo" | "baz foo bar" | "baz bar" | "baz bar foo"`
type Keys = Combination<["foo", "bar", "baz"]>;
```

#### 문제 설명

- string 배열을 받아, combination을 만들어 반환

#### 시도 1 (정답)

> 접근 방식

- 4260. All Combination 참고하여 같은 원리로 접근
- 참고: [All Combination](https://velog.io/@hayou/TS-Type-Challenges-%EC%8A%A4%ED%84%B0%EB%94%94-11%EC%A3%BC%EC%B0%A8#medium-4260-all-combinations)

> 코드

```ts
type MakeCombination<A extends string, B extends string> =
  | A
  | B
  | `${A} ${B}`
  | `${B} ${A}`;

type UnionCombination<A extends string, B extends string = A> = A extends B
  ? MakeCombination<A, UnionCombination<Exclude<B, A>>>
  : never;

type Combination<T extends string[]> = UnionCombination<T[number]>;
```

> 코드 설명

- `MakeCombination` : 두 문자열을 받아, 순서를 바꾸어 조합하여 반환
- `UnionCombination` : 문자열 유니온을 순회하며, 각 요소와 나머지 요소를 `MakeCombination` 함수에 전달하여 조합
- `Combination` : 문자열 배열을 받아, `UnionCombination`에 유니온으로 변환하여 넣어줌
