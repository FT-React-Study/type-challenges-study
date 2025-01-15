## 3058-Push

> View on GitHub: https://tsch.js.org/3058

### 문제

`Array.push`의 제네릭 버전을 구현하세요.

### 정답

```ts
type Push<T extends any[], U> = [...T, U];
```

### 설명

- `[...T, U]`는 타입 `T`의 배열에 타입 `U`를 추가한 새로운 배열을 반환
- `...`는 스프레드 연산자로, 배열을 풀어서 각 요소를 별도의 인수로 전달
- `T extends any[]`는 타입 `T`가 배열이어야 함을 제약
- `U`는 추가할 요소의 타입

### 추가 질문

### Reference
