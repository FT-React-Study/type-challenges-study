# 298-LengthOfString

> View on GitHub: https://tsch.js.org/298

## 문제

`String#length`처럼 동작하는 문자열 리터럴의 길이를 구하세요.

## 정답

```ts
type StringToTuple<S extends String> = S extends `${infer First}${infer Last}`
  ? [First, ...StringToTuple<Last>]
  : [];

type LengthOfString<S extends string> = StringToTuple<S>["length"];
```

## 설명

- `StringToTuple` 함수는 문자열을 튜플로 변환하는 함수
- `String` 타입이 인자로 들어오면 한 글자씩 나눠 튜플로 변환
- 그렇게 구해진 튜플의 길이를 반환하면 문자열의 길이를 구할 수 있음
