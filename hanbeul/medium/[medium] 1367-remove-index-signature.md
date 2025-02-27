# 1367 - Remove Index Signature

## 문제

객체 유형에서 인덱스 시그니처를 제외하는 `RemoveIndexSignature<T>`를 구현하세요

> 예시

```ts
type Foo = {
  [key: string]: any;
  foo(): void;
};

type A = RemoveIndexSignature<Foo>; // expected { foo(): void }
```

## 풀이

### 시도 1

> 접근 방식

- key-remapping으로 키 값이 [key: any] 형태를 걸러내면 되지 않을까?

> 코드

```ts
type RemoveIndexSignature<T> = {
  [K in keyof T as K extends [key: keyof any] ? never : K]: T[K];
};
```

> 실패 이유

- `[key: keyof any]` 형태 걸러내기 실패

### 시도 2 (답지 확인)

> 접근 방식

> 코드

```ts
type RemoveIndexSignature<T, P = PropertyKey> = {
  [K in keyof T as P extends K ? never : K extends P ? K : never]: T[K];
};
```

> 코드 설명

- `P`는 `PropertyKey`로 선언
- key-remapping으로 `P extends K` 조건을 만족하는 경우, 해당 키 값을 제거
- `P extends K` 조건을 만족한다는 것은 `K`가 `P(string | number | symbol)`의 슈퍼타입이라는 것
- 즉, `K`가 `string`, `number`, `symbol`이면 `never`을 반환하여 키를 삭제
- 이후 `K extends P` 조건을 만족하는 경우(K가 P의 서브타입일 경우, 예를 들어 `'foo'`, `123`, `symbol` 등), `K`를 반환하여 키를 유지

## 추가 질문

> PropertyKey 타입이란 무엇인가?

- `keyof any`와 같은 타입
- 문자열, 숫자, 심볼 타입을 포함하는 유니온 타입

> Index Signature란 무엇인가?

- 인덱스 시그니처란 객체의 키 값을 동적으로 정의하는 방법
- 해당 키가 인덱스 시그니처로 정의된 타입일 경우, 값의 타입 또한 동적으로 정의됨
- 참조: https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
