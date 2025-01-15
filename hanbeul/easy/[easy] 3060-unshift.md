## 3060-Unshift

> View on GitHub: https://tsch.js.org/3060

### 문제

`Array.unshift`의 제네릭 버전을 구현하세요.

### 정답

```ts
type Unshift<T extends any[], U> = [U, ...T];
```

### 설명

- `[U, ...T]`는 타입 `U`를 첫 번째 요소로 하고, 타입 `T`의 배열을 나머지 요소로 하는 새로운 배열을 반환
- `...`는 스프레드 연산자로, 배열을 풀어서 각 요소를 별도의 인수로 전달
- `T extends any[]`는 타입 `T`가 배열이어야 함을 제약
- `U`는 추가할 요소의 타입

### 추가 질문

### Reference
