## 9-Deep Readonly

> View on GitHub: https://tsch.js.org/9

### 문제

객체의 프로퍼티와 모든 하위 객체를 재귀적으로 읽기 전용으로 설정하는 제네릭 DeepReadonly<T>를 구현하세요.

이 챌린지에서는 타입 파라미터 T를 객체 타입으로 제한하고 있습니다. 객체뿐만 아니라 배열, 함수, 클래스 등 가능한 다양한 형태의 타입 파라미터를 사용하도록 도전해 보세요.

### 정답

```ts
type DeepReadonly<T> = T extends object
  ? T extends Function
    ? T
    : { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
```

### 설명

- 첫 번째 조건부 타입은 `T`가 객체인 경우를 체크, 객체가 아닌 경우 `T`를 반환
- 두 번째 조건부 타입은 `T`가 객체이지만 함수일 경우 `T`를 반환 (해당 조건이 없을 경우, 함수일 경우 빈 객체를 반환)
- 만약 `T`가 객체이고 함수가 아니라면 객체의 프로퍼티를 읽기 전용으로 설정한 타입을 반환

### 추가 질문

> 배열이 제대로 처리되는 이유

- 우선, 배열은 객체이자 함수가 아님.
- 따라서 `T`가 배열일 경우 `{ readonly [K in keyof T]: DeepReadonly<T[K]> }` 타입을 반환
- 배열에서 `keyof`는 인덱스와 특수키(length, push 등)를 포함함.

```ts
type TestArray = [1, 2, 3];
type Keys = keyof TestArray; // "0" | "1" | "2" | "length" | "push" | "pop" | "concat" | ...
```

- 인덱스를 통해 배열 요소에 접근, 각 요소에 대해 DeepReadonly를 재귀적으로 호출
- 특수 키의 경우 이미 읽기 전용으로 설정되어 있어 별도로 표시하지 않음

### Reference
