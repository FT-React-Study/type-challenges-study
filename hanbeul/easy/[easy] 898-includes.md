## 898-Includes

> View on GitHub: https://tsch.js.org/898

### 문제

JavaScript의 `Array.includes` 함수를 타입 시스템에서 구현하세요. 타입은 두 인수를 받고, `true` 또는 `false`를 반환해야 합니다.

### 정답

```ts
type MyEqual<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

type Includes<T extends readonly any[], U> = T extends [
  infer First,
  ...infer Rest,
]
  ? MyEqual<First, U> extends true
    ? true
    : Includes<Rest, U>
  : false;
```

### 설명

- `MyEqual` 타입은 두 타입이 같은지 확인하는 타입. 두 타입이 같으면 `true`, 다르면 `false`를 반환
- `<T>() => T extends X ? 1 : 2` 타입은 타입 `T`가 `X`의 서브타입이면 `1`, 아니면 `2`를 반환하는 타입
- `T extends [infer First, ...infer Rest]` 타입은 타입 `T`가 배열이면 `First`는 첫 번째 요소, `Rest`는 나머지 요소들을 반환
- 재귀적으로 `First`와 `U`를 비교하여 한 번이라도 같으면 `true`, 다르면 `false`를 반환

### 추가 질문

> `<T>()` 는 무엇인가?

- TypeScript에서 익명 제네릭 함수 타입을 정의하는 방식
- `T`는 함수 내부에서 사용할 수 있는 제네릭 타입 매개변수
- 아무 변수명이나 가능하지만(`<A>`), 제네릭 타입 매개변수라는 것을 명시해야 함

> `MyEqual`에 대한 이해

- `MyEqual`은 두 타입이 같은지 확인하는 타입
- `(<T>() => T extends X ? 1 : 2)`는 `T`가 `X`의 서브타입이면 `1`, 아니면 `2`를 반환하는 타입
- `(<T>() => T extends Y ? 1 : 2)`는 `T`가 `Y`의 서브타입이면 `1`, 아니면 `2`를 반환하는 타입
- Typescript는 함수 비교를 시행할 때, `구조적 동등성`을 사용하여 비교 (JavaScript에서는 함수 비교를 시행할 때, `참조적 동등성`을 사용하여 비교)
- 구조적 동등성은 함수의 매개변수와 반환 타입의 구조만 비교하고, 함수 이름이나 함수 본문은 비교하지 않음
- 따라서 `MyEqual`은 두 함수의 매개변수와 반환 타입이 같으면 `true`, 다르면 `false`를 반환하는 타입

```ts
type A = <T>() => T extends string ? 1 : 2;
type B = <T>() => T extends string ? 1 : 2;

type AreEqual = A extends B ? true : false;
// A와 B의 함수 타입 구조가 동일하므로, A extends B는 true로 평가됨
```

```ts
type A = <T>() => T extends string ? 1 : 2;
type B = <T>() => T extends number ? 1 : 2;

type AreEqual = A extends B ? true : false;
// A와 B의 함수 타입 구조가 다르므로, A extends B는 false로 평가됨
```

```ts
type A = <T>() => T extends string ? 1 : 2;
type B = <T>() => T extends string ? 1 : 3;

type AreEqual = A extends B ? true : false;
// A와 B의 함수 타입 구조가 다르므로, A extends B는 false로 평가됨
```

### Reference
