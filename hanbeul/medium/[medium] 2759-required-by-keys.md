# 2759 - Required By Keys

## 문제

두 개의 타입 인자 `T`와 `K`를 받는 제네릭 타입 `RequiredByKeys<T, K>`를 구현하세요.

`K`는 필수(required)로 설정되어야 하는 `T`의 속성들을 지정합니다. `K`가 제공되지 않을 경우, 일반적인 `Required<T>`처럼 모든 속성을 필수로 만들어야 합니다.

> 예시

```typescript
interface User {
  name?: string;
  age?: number;
  address?: string;
}

type UserRequiredName = RequiredByKeys<User, "name">; // { name: string; age?: number; address?: string }
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- 옵셔널한 키 값들을 필수로 만들기 위해 Required를 사용
- Omit & Pick을 활용해 한번에 처리

> 코드

```ts
type RequiredByKeys<T, K extends keyof T = keyof T> = Omit<T, K> &
  Required<Pick<T, K>> extends infer O
  ? { [Key in keyof O]: O[Key] }
  : never;
```

> 코드 설명

- `Omit<T, K>`: `T`에서 `K` 키 값들을 제외한 타입
- `Required<Pick<T, K>>`: `T`에서 `K` 키 값들만 선택하고, 그 값들을 필수로 만든 타입
- `extends infer O`: 위 두 타입을 인터섹션 처리하여 하나의 타입으로 만듦
- `? { [Key in keyof O]: O[Key] }`: 위 타입을 객체로 반환
