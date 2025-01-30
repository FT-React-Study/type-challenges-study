# 15-Last of Array

> View on GitHub: https://tsch.js.org/15

### 문제

배열 T를 사용하고 마지막 요소를 반환하는 제네릭 Last<T>를 구현합니다.

예시

```ts
type arr1 = ["a", "b", "c"];
type arr2 = [3, 2, 1];

type tail1 = Last<arr1>; // expected to be 'c'
type tail2 = Last<arr2>; // expected to be 1
```

### 정답

```ts
type Last<T extends any[]> = T extends [...infer Rest, infer Last]
  ? Last
  : never;
```

### 설명

- 898-includes 문제 참고
- 스프레드 연산자를 이용해 배열을 분해하고, 마지막 요소를 반환

### 추가 질문

### Reference
