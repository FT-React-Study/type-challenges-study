## [medium] 10969. Integer

> View on GitHub: https://tsch.js.org/10969

#### 문제

Please complete type `Integer<T>`, type `T` inherits from `number`, if `T` is an integer return it, otherwise return `never`.

#### 문제 설명

- 숫자를 받아, 정수일 경우 숫자를 반환, 소수일 경우 `never` 반환

#### 시도 1

> 접근 방식

- 우선 숫자인지 확인
- 숫자일 경우 템플릿 리터럴로 분리해버리기
- 분리한 템플릿 리터럴에서 소수점 이하 숫자가 0인지 확인

> 코드

```ts
type IsAllZero<T extends string> = T extends `${infer First}${infer Rest}`
  ? First extends "0"
    ? IsAllZero<Rest>
    : false
  : true;

type Integer<T> = [T] extends [number]
  ? number extends T
    ? never
    : `${T}` extends `${infer _Int}.${infer Float}`
    ? IsAllZero<Float> extends true
      ? T
      : never
    : T
  : never;
```

> 코드 설명

- 우선 숫자인지 확인 (`[T] extends [number]`, `number extends T`)
- 숫자일 경우 템플릿 리터럴로 분리 (`${T}` extends `${infer _Int}.${infer Float}`)
- 분리한 템플릿 리터럴에서 소수점 이하 숫자가 0인지 확인 (`IsAllZero<Float> extends true`)
- 소수점 이하 숫자가 0일 경우 정수 반환, 아닐 경우 `never` 반환
