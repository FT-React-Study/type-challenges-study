# 2757 - PartialByKeys

## 문제

두 개의 타입 인수 `T`와 `K`를 사용하는 `PartialByKeys<T, K>`를 구성하세요.

`K`는 옵셔널하며 `T`의 프로퍼티로 이루어진 유니언 타입을 지정할 수 있습니다. `K`를 제공하지 않는다면 `Partial<T>`와 같이 모든 프로퍼티를 옵셔널하게 만들어야 합니다.

> 예시

```typescript
interface User {
  name: string;
  age: number;
  address: string;
}

type UserPartialName = PartialByKeys<User, "name">; // { name?:string; age:number; address:string }
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- 키 값을 순회하면서, 조건부 처리를 해보자

> 코드

```ts
type PartialByKeys<
  T,
  K extends keyof T = keyof T,
  U = {
    [Key in keyof T as Key extends K ? Key : never]?: T[Key];
  } & Omit<T, K>,
> = { [UK in keyof U]: U[UK] };
```

> 코드 설명

- 우선 `T`의 `key` 값을 순회하기 위해 `Key in keyof T` 를 사용
- 이 때, `K` 타입에 해당하는 키 값만 옵셔널하게 처리하기 위해 `Key extends K` 조건을 추가
- `K` 타입에 해당하는 키 값만 옵셔널하게 처리
- 이렇게 만들어진 타입을 `U`라고 하자
- `K` 타입에 해당하지 않는 키 값들은 `Omit<T, K>` 타입으로 만들어 두 타입을 인터섹션 처리
- 그렇게 만들어진 인터섹션 타입 `U`을 순회하여 객체로 반환
