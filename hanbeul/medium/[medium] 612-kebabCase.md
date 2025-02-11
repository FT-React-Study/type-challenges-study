# 612 - KebabCase

> View on GitHub: https://tsch.js.org/612

## 문제

- `camelCase`나 `PascalCase`를 `kebab-case` 문자열로 수정하세요.
- `FooBarBaz` -> `foo-bar-baz`

## 문제 설명

- 문자열을 `kebab-case`로 변환하는 문제
- 문자열 내에 대문자가 있는 경우, 대문자를 소문자로 변환하고 대문자 앞에 `-`를 붙임
- 만약 맨 앞 글자가 대문자라면, 소문자로 변환하고 앞에 `-`를 붙이지 않음
- 알파벳이 아닌 경우, 그대로 반환

## 정답

```ts
type IsAlphabet<T extends string> =
  Lowercase<T> extends Uppercase<T> ? false : true;

type IsUpperCase<T extends string> =
  IsAlphabet<T> extends true ? (Uppercase<T> extends T ? true : false) : false;

type MakeKebabCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? IsUpperCase<First> extends true
    ? `-${Lowercase<First>}${MakeKebabCase<Rest>}`
    : `${First}${MakeKebabCase<Rest>}`
  : "";

type KebabCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? IsUpperCase<First> extends true
    ? `${Lowercase<First>}${MakeKebabCase<Rest>}`
    : `${First}${MakeKebabCase<Rest>}`
  : "";
```

## 설명

- `IsAlphabet` 타입은 문자열이 알파벳인지 확인하는 타입(만약 T가 알파벳이라면 `Lowercase<T>`가 `Uppercase<T>`의 서브타입이 될 수 없음)
- `IsUpperCase` 타입은 문자열이 알파벳일 경우, 대문자인지 확인하는 타입
- `MakeKebabCase` 타입은 `First`가 대문자일 경우, `Lowercase<First>`를 통해 소문자로 변환한 뒤 `-`를 붙이고 `Rest`를 재귀적으로 호출
- `KebabCase` 타입은 최초의 `First`가 대문자일 경우, `Lowercase<First>`를 통해 소문자로 변환한 뒤 `-`를 붙이지 않고, `Rest`를 `MakeKebabCase` 타입으로 호출

## 오답노트

> 1차 시도

```ts
type IsUpperCase<T extends string> = T extends Uppercase<T> ? true : false;

type MakeKebabCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? IsUpperCase<First> extends true
    ? `-${Lowercase<First>}${MakeKebabCase<Rest>}`
    : `${First}${MakeKebabCase<Rest>}`
  : "";

type KebabCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? IsUpperCase<First> extends true
    ? `${Lowercase<First>}${MakeKebabCase<Rest>}`
    : `${First}${MakeKebabCase<Rest>}`
  : "";

type ex1 = KebabCase<"foo-bar">;
// "foo--bar"
type ex2 = KebabCase<"foo_bar">;
// "foo-_bar"
type ex3 = KebabCase<"Foo-Bar">;
// "foo---bar"
```

- 알파벳이 아닌 다른 문자열들의 경우, `IsUpperCase`가 무조건 `true`를 반환하여 `-`를 붙임
