## 106-Trim-Left

> View on GitHub: https://tsch.js.org/106

### 문제

정확한 문자열 타입이고 시작 부분의 공백이 제거된 새 문자열을 반환하는 TrimLeft<T>를 구현하십시오.

```ts
type trimed = TrimLeft<"  Hello World  ">; // expected to be 'Hello World  '
```

### 정답

```ts
type TrimLeft<S extends string> = S extends `${" " | "\n" | "\t"}${infer Rest}`
  ? TrimLeft<Rest>
  : S;
```

### 설명

- 문자열 `S`가 `" " | "\n" | "\t"`로 시작하는지 확인
- 시작하면 문자열 `S`에서 시작 부분의 공백을 제거한 새 문자열(`Rest`)을 반환
- 시작하지 않으면 주어진 문자열 `S`를 그대로 반환

### 추가 질문

### Reference
