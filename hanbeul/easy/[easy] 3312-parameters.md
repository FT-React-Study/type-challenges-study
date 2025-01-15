## 3312-Parameters

> View on GitHub: https://tsch.js.org/3312

### 문제

내장 제네릭 Parameters<T>를 이를 사용하지 않고 구현하세요.

### 정답

```ts
type MyParameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer U
) => any
  ? U
  : never;
```

### 설명

- `T`가 `(...args: any[]) => any` 형태(함수 타입)인지 확인
- 맞다면 `args` 부분(= 함수의 파라미터들)을 `infer U`라고 두어 '함수 매개변수들의 튜플 타입'을 추론
- 추론한 타입 `U`를 반환
- 함수가 아니라면 `never` 반환
- `...args`는 아무 이름이어도 되고, TypeScript에서 그냥 ‘추론할 위치’가 `rest parameter`임을 표시하기 위한 placeholder

### 추가 질문

### Reference

- [TypeScript 공식 문서 - Parameters](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)
