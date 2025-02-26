# 2693 - Ends With

## 문제

문자열 `T`가 문자열 `U`로 끝나는지 확인하는 `EndsWith<T, U>`를 구현하세요.

> 예시

```ts
type a = EndsWith<"abc", "bc">; // expected to be true
type b = EndsWith<"abc", "abc">; // expected to be true
type c = EndsWith<"abc", "d">; // expected to be false
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- startsWith 문제를 참고해서 풀어보자
- 문자열을 뒤집어서 확인하는 방식으로 해결

> 코드

```ts
type ReverseString<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${ReverseString<Rest>}${First}`
  : S;

type StartsWith<T extends string, U extends string> = T extends U
  ? true
  : T extends `${infer TFirst}${infer TRest}`
    ? U extends `${infer UFirst}${infer URest}`
      ? TFirst extends UFirst
        ? StartsWith<TRest, URest>
        : false
      : true
    : false;

type EndsWith<T extends string, U extends string> = StartsWith<
  ReverseString<T>,
  ReverseString<U>
>;
```

> 코드 설명

- `ReverseString<T>`: 문자열 T를 뒤집은 문자열
- `StartsWith<ReverseString<T>, ReverseString<U>>`: 뒤집은 문자열 T와 U를 비교
