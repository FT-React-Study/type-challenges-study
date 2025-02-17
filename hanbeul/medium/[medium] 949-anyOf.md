# 949 - AnyOf

## 문제

Python의 `any` function을 타입 시스템으로 구현하세요

배열을 사용하고 배열의 요소가 참이면 `true`를 반환합니다. 배열이 비어 있으면 `false`를 반환합니다

> 예시

```ts
type Sample1 = AnyOf<[1, "", false, [], {}]>; // expected to be true.
type Sample2 = AnyOf<[0, "", false, [], {}]>; // expected to be false.
```

## 풀이

### 시도 1

> 접근 방식

- 빈 배열인지 확인한 후, 빈 배열이 아닐 경우 재귀를 이용해 각 요소를 순회하며 단 한 번이라도 false 값을 가질 경우 false 리턴
- false 값인지는 따로 객체를 만들어 확인

> 코드

```ts
type IsFalse = 0 | "" | false | [] | {} | undefined | null;
type AnyOf<T extends readonly any[]> = T extends []
  ? false
  : T extends [infer First, ...infer Rest]
    ? First extends IsFalse
      ? AnyOf<Rest>
      : true
    : false;
```

> 실패 이유

- `IsFalse`에 들어있는 `{}`가 모든 객체를 false로 잡아버림

### 시도 2

> 접근 방식

- 기존 방식에서, `isEmptyObject`라는 타입을 만들어 빈 객체를 false로 처리하도록 변경

> 코드

```ts
type IsEmptyObject<T> = keyof T extends never ? true : false;
type IsFalse<T> = T extends 0 | "" | false | [] | undefined | null
  ? true
  : T extends object
    ? IsEmptyObject<T>
    : false;

type AnyOf<T extends readonly any[]> = T extends []
  ? false
  : T extends [infer First, ...infer Rest]
    ? IsFalse<First> extends true
      ? AnyOf<Rest>
      : true
    : false;
```

> 코드 설명

- `IsEmptyObject`는 `keyof T`가 `never`(키가 존재하지 않는 빈 객체)일 경우 true를 리턴하는 타입
- `IsFalse`는 비어있는 배열, 0, "", false, undefined, null, 그리고 빈 객체를 true로 처리하는 타입
- `AnyOf`는 빈 배열일 경우 false를 리턴
- 비어있지 않을 경우 재귀를 이용해 각 요소를 순회하며 단 한 번이라도 `IsFalse` 타입이 false 값을 가질 경우 false 리턴
