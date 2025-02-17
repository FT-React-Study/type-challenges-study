# 1042 - IsNever

## 문제

input type으로 `T`를 받는 IsNever type을 구현하세요. 만약 `T`의 유형이 `never`으로 확인되면 `true`를 반환하고 아니면 `false`를 반환합니다

> 예시

```ts
type A = IsNever<never>; // expected to be true
type B = IsNever<undefined>; // expected to be false
type C = IsNever<null>; // expected to be false
type D = IsNever<[]>; // expected to be false
type E = IsNever<number>; // expected to be false
```

## 풀이

### 시도

> 접근 방식

- `T`가 `never`일 경우 `true`를 리턴하고 아니면 `false`를 리턴

> 코드

```ts
type IsNever<T> = [T] extends [never] ? true : false;
```

> 코드 설명

- `[T] extends [never]`은 `T`가 `never`일 경우 `true`를 리턴하고 아니면 `false`를 리턴(분배법칙 X)
