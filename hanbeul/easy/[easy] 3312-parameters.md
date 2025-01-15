## 3312-Parameters

> View on GitHub: https://tsch.js.org/3312

### 문제

내장 제네릭 Parameters<T>를 이를 사용하지 않고 구현하세요.

### 정답

```ts
type MyParameters<T extends (...args: any[]) => any> = T extends (
  ...any: infer U
) => any
  ? U
  : never;
```

### 설명

- `T`가 함수 타입이라면, `infer`를 사용하여 함수의 매개변수 타입을 추출
- `infer`를 사용하여 함수의 매개변수 타입을 추출하고, 그 타입을 반환

### 추가 질문

### Reference

- [TypeScript 공식 문서 - Parameters](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)
