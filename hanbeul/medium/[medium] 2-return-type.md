## 2-Return Type

> View on GitHub: https://tsch.js.org/2

### 문제

내장 제네릭 ReturnType<T>을 이를 사용하지 않고 구현하세요.

### 정답

```ts
type MyReturnType<T extends Function> = T extends (...args: any) => infer U
  ? U
  : never;
```

### 설명

- `ReturnType<T>`이란 `T`의 반환 타입을 반환하는 제네릭 타입이다.
- 우선, `T`가 `Function` 타입인지 확인
- 맞다면 반환 타입을 `infer U`로 추론해 추론한 타입 `U`를 반환
- 함수가 아니라면 `never` 반환
- parameters와 마찬가지로 `...args`는 아무 이름이어도 되고, TypeScript에서 그냥 ‘추론할 위치’가 `rest parameter`임을 표시하기 위한 placeholder

### 추가 질문

> `(...args:any)는 되고 (args: any)는 안되는 이유는?

- `(...args: any)` 형태는 0개 이상의 매개변수를 허용하며, 모든 매개변수는 배열 형태로 캡처
- `(args: any)` 형태는 1개의 매개변수를 허용하며, 매개변수는 단일 값으로 캡처
- 따라서 f1와 같이 2개 이상의 매개변수를 받기 위해서는 `(...args: any)` 형태로 작성해야 함

### Reference

- [TypeScript 공식 문서 - ReturnType](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)
