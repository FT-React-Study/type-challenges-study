## 16-Pop

> View on GitHub: https://tsch.js.org/16

### 문제

배열 T를 사용해 마지막 요소를 제외한 배열을 반환하는 제네릭 Pop<T>를 구현합니다.

예시

```ts
type arr1 = ["a", "b", "c", "d"];
type arr2 = [3, 2, 1];

type re1 = Pop<arr1>; // expected to be ["a", "b", "c"];
type re2 = Pop<arr2>; // expected to be [3, 2];
```

### 정답

```ts
type Pop<T extends any[]> = T extends [...infer Rest, infer Last] ? Rest : [];
```

### 설명

- 15번 문제와 동일하게 스프레드 연산자를 이용해 배열을 분해하고, 마지막 요소를 제외한 배열을 반환

### 추가 질문

### Reference
