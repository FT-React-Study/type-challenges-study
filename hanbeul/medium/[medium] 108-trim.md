## 108-Trim

> View on GitHub: https://tsch.js.org/108

### 문제

정확한 문자열 타입이고 시작 부분의 공백이 제거된 새 문자열을 반환하는 Trim<T>를 구현하십시오.

```ts
type trimmed = Trim<"  Hello World  ">; // expected to be 'Hello World'
```

### 정답

```ts
type TrimLeft<S extends string> = S extends `${" " | "\n" | "\t"}${infer Rest}`
  ? TrimLeft<Rest>
  : S;

type TrimRight<S extends string> = S extends `${infer Rest}${" " | "\n" | "\t"}`
  ? TrimRight<Rest>
  : S;

type Trim<S extends string> = TrimRight<TrimLeft<S>>;
```

### 설명

- 106번 `TrimLeft<S>` 활용해 문자열 `S`에서 시작 부분의 공백을 제거한 새 문자열을 반환
- 같은 원리로 `TrimRight<S>`를 정의해 문자열 `S`에서 끝 부분의 공백을 제거한 새 문자열을 반환
- `Trim<S>`: `TrimLeft<S>`와 `TrimRight<S>`를 조합하여 문자열 `S`에서 양쪽 끝의 공백을 제거한 새 문자열을 반환

### 추가 질문

### Reference
