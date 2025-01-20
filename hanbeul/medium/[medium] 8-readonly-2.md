## 8-Readonly 2

> View on GitHub: https://tsch.js.org/8

### 문제

`T`에서 `K` 프로퍼티만 읽기 전용으로 설정해 새로운 오브젝트 타입을 만드는 제네릭 `MyReadonly2<T, K>`를 구현하세요. `K`가 주어지지 않으면 단순히 `Readonly<T>`처럼 모든 프로퍼티를 읽기 전용으로 설정해야 합니다.

### 정답

```ts
type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [P in keyof T as P extends K ? P : never]: T[P];
} & { [P in keyof T as P extends K ? never : P]: T[P] };
```

### 설명

- 3-omit 문제에서 사용한 `as`를 활용한 필터링 기능 사용
- 첫 번째 집합에는 `K`에 할당할 수 있는 T의 키 값인 P에 대해서는 `readonly` 키워드를 붙이고, 그렇지 않은 키 값에 대해서는 제거
- 두 번째 집합에는 `K`에 할당할 수 있는 T의 키 값인 P에 대해서는 제거, 그렇지 않은 키 값에 대해서는 기존 타입 유지
- 두 집합을 union 타입으로 합치면 원하는 타입이 완성

### 추가 질문

### Reference
