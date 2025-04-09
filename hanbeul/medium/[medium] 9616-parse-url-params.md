## [medium] 9616. Parse URL Params

#### 문제

> View on GitHub: https://tsch.js.org/9616

You're required to implement a type-level parser to parse URL params string into an Union.

> 예시

```ts
ParseUrlParams<":id">; // id
ParseUrlParams<"posts/:id">; // id
ParseUrlParams<"posts/:id/:user">; // id | user
```

#### 문제 설명

- 문자열을 받아, 파라미터를 파싱하여 유니온 타입으로 반환

#### 시도 1

> 접근 방식

- 템플릿 리터럴을 활용해, `first`, `:`, `param`, `/`, `rest`로 나누어 파싱

> 코드

```ts
type ParseUrlParams<T> = T extends `${infer _}:${infer Param}/:${infer Rest}`
  ? Param | ParseUrlParams<Rest>
  : T extends `${infer _}:${infer Param}`
  ? Param extends `${infer First}/`
    ? First
    : Param
  : never;
```

> 코드 설명

- 템플릿 리터럴을 활용해, `first`, `:`, `param`, `/`, `rest`로 나누어 파싱
- 조건부를 활용해 `:`, `/`, `/:` 각 조건의 맞게 확인

> 실패 이유

- 분기처리가 너무 많아져서 복잡해짐
- 더 간단하게 해결할 방법이 있을 것 같음

#### 시도 2 (정답)

> 접근 방식

- `/` 단위로 나누고, 그다음에 `:` 가 붙어있는지 확인

> 코드

```ts
type ParseUrlParams<T> = T extends `${infer Start}/${infer Rest}`
  ? ParseUrlParams<Start> | ParseUrlParams<Rest>
  : T extends `:${infer Param}`
  ? Param
  : never;
```
