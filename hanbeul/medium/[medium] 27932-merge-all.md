## [medium] 27932. Merge All

> View on GitHub: https://tsch.js.org/27932

#### 문제

Merge variadic number of types into a new type. If the keys overlap, its values should be merged into an union.

> 예시

```ts
type Foo = { a: 1; b: 2 };
type Bar = { a: 2 };
type Baz = { c: 3 };

type Result = MergeAll<[Foo, Bar, Baz]>; // expected to be { a: 1 | 2; b: 2; c: 3 }
```

#### 문제 설명

- 가변 인자의 타입을 하나의 타입으로 병합
- 키가 겹칠 경우 값을 합치는(union) 문제

#### 시도 1

> 접근 방식

- `T extends T` 꼴로 각 요소를 순회하며 키를 확인
- 만약에 키가 `result`에 존재하면 해당 키의 값을 머지
- 만약에 키가 `result`에 존재하지 않으면 해당 키의 값을 추가

> 코드

```ts
type MergeAll<XS extends any[], Result = {}> =
  XS extends [infer First, ...infer Rest]
    ? { [Key in keyof Result]: Key extends keyof First ? Result[Key] | First[Key] : Result[Key] }.. 어쩌구
    : Result
```

> 실패 이유

- 조건문이 너무 많이 들어가고, 명확하게 코드 진행이 되지 않는 느낌
- 다른 방식으로 해결하고자 접근방식 변경

#### 시도 2

> 접근 방식

- 기존 Merge 로직 사용
- `T extends [infer First, ...infer Rest]` 꼴로 각 요소를 순회하며 키를 확인
- 해당 요소를 Merge 처리해주고, 이후 재귀로 처리

> 코드

```ts
type Merge<F, S> = {
  [K in keyof F | keyof S]: K extends keyof F
    ? K extends keyof S
      ? F[K] | S[K]
      : F[K]
    : K extends keyof S
    ? S[K]
    : never;
};

type MergeAll<T extends object[], Result = {}> = T extends [
  infer First extends object,
  ...infer Rest extends object[]
]
  ? MergeAll<Rest, Merge<Result, First>>
  : Result;
```

> 코드 설명

- `Merge<Result, First>` : 현재 요소와 이전 결과를 Merge 처리 (기존에 사용하던 Merge 로직 참고, 단 유니온 처리)
- `MergeAll<Rest, Merge<Result, First>>` : 이후 재귀로 처리
- `Result` : 최종 결과
