## 문제

문자열 타입을 받아 끝부분의 공백을 제거한 새로운 문자열을 반환하는 `TrimRight<T>`를 구현하세요.

> 예시

```ts
type Trimed = TrimRight<"   Hello World    ">; // expected to be '   Hello World'
```

> 문제 설명

- 문자열 타입을 받아 끝부분의 공백을 제거한 새로운 문자열을 반환

#### 시도 1 (정답)

> 접근 방법

- 템플릿 리터럴로 마지막 글자에 whitespaces가 들어가는 지 확인 후 들어가면 재귀

> 코드

```ts
type TrimRight<S extends string> = S extends `${infer T}${" " | "\n" | "\t"}`
  ? TrimRight<T>
  : S;
```

> 코드 설명

- `S`를 재귀적으로 탐색하면서 `T` 요소 확인
- `T` 요소가 `whitespaces(' ' | '\n' | '\t')`가 들어가는 지 확인
- `whitespaces`가 들어가면 재귀
- `whitespaces`가 들어가지 않으면 그냥 반환
