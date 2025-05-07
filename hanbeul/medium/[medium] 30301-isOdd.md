## [medium] 30301. IsOdd

> View on GitHub: https://tsch.js.org/30301

#### 문제

return true is a number is odd

#### 문제 설명

- 주어진 숫자가 홀수인지 짝수인지 판별하는 타입

#### 시도 1

> 접근 방식

- 숫자를 문자열로 변환
- number인지, float인지, e-number인지 확인
- 마지막 자리 숫자를 확인

> 코드

```ts
type LastChar<S extends string> = S extends `${infer _}${infer R}`
  ? R extends ""
    ? S
    : LastChar<R>
  : never;

type IsOdd<T extends number> = `${T}` extends
  | `${string}.${string}`
  | `${string}e${string}`
  ? false
  : LastChar<`${T}`> extends "1" | "3" | "5" | "7" | "9"
  ? true
  : false;
```

> 코드 설명

- `LastChar<S>`는 문자열의 마지막 문자를 반환하는 타입
- 만약 `${T}`가 `.${string}` 또는 `e${string}`인 경우, false를 반환
- 만약 `${T}`의 마지막 문자가 `1` | `3` | `5` | `7` | `9`인 경우, true를 반환
- 그 외의 경우, false를 반환
- `3e0`의 경우, `${3e0}`는 `3`으로 인식, `3e23`의 경우, `${3e23}`는 `{string}e${string}`으로 인식
