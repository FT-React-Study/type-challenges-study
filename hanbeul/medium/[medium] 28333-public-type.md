## [medium] 28333. Public Type

> View on GitHub: https://tsch.js.org/28333

#### 문제

Remove the key starting with `_` from given type `T`.

#### 문제 설명

주어진 타입 `T`에서 `_`로 시작하는 키를 제거

#### 시도 1 (정답)

> 접근 방식

- 타입 `T`의 키를 순회하면서, `_`로 시작하는 키를 제거

> 코드

```ts
type PublicType<T extends object> = {
  [K in keyof T as K extends `_${infer _}` ? never : K]: T[K];
};
```

> 코드 설명

- `K`로 `T`의 키를 순회, 템플릿 리터럴 타입을 사용해 `_`로 시작하는 키를 제거
- 제거된 키는 `never`로 처리되어 빠짐
- 나머지 키와 값은 그대로 반환
