## 533-Concat

> View on GitHub: https://tsch.js.org/533

### 문제

JavaScript의 `Array.concat` 함수를 타입 시스템에서 구현하세요. 타입은 두 인수를 받고, 인수를 왼쪽부터 `concat`한 새로운 배열을 반환해야 합니다.

### 정답

```ts
type Concat<T extends readonly any[], U extends readonly any[]> = [...T, ...U];
```

### 설명

- 튜플과 배열 모두 받기 위해 `readonly any[]`를 사용
- spread 연산자를 사용하여 두 배열을 합침
- 타입 레벨에서는 객체의 스프레드는 지원하지 않음

### 추가 질문

### Reference
