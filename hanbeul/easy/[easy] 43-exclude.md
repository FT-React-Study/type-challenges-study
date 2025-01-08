## 43-Exclude

> View on GitHub: https://tsch.js.org/43

### 문제

`T`에서 `U`에 할당할 수 있는 타입을 제외하는 내장 제네릭 `Exclude<T, U>`를 이를 사용하지 않고 구현하세요.

### 정답

```ts
type MyExclude<T, U> = T extends U ? never : T;
```

### 설명

- `T extends U`는 `T`가 `U`에 할당할 수 있는지(`T`가 `U`의 서브타입인지) 여부를 확인
- `T`가 `U`에 할당할 수 있으면 `never`를 반환하고, 그렇지 않으면 `T`를 반환

### 추가 질문

> 유니온 타입('a' | 'b' | 'c')에서 `T`가 동작하는 방식

- 조건부 타입의 분배 법칙(Distributive Property)
- `T`는 유니온 타입의 각 구성 요소에 대해 개별적으로 판단 (이 예시에서는 `extends`를 판단)

### Reference

- [TypeScript 공식문서 - 조건부 타입](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Typescript 공식문서 - Exclude](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers)
