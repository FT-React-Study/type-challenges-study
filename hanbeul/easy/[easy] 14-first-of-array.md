## 14-First of Array

> View on GitHub: https://tsch.js.org/14

### 문제

배열(튜플) T를 받아 첫 원소의 타입을 반환하는 제네릭 First<T>를 구현하세요.

### 정답

```ts
type First<T extends any[]> = T extends [] ? never : T[0];
```

### 설명

- `T extends []`는 배열 `T`가 비어있는지 확인
- `T[0]`는 배열 `T`의 첫 번째 요소를 가져옴
- `T extends [] ? never : T[0]`는 배열 `T`가 비어있으면 `never`를 반환하고, 비어있지 않으면 첫 번째 요소를 반환

### 추가 질문

### Reference
