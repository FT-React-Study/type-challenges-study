# 1097 - IsUnion

## 문제

`T`를 입력으로 받고, `T`가 `Union` 유형으로 확인되는지 여부를 반환하는 `IsUnion`을 구현하세요

> 예시

```ts
type case1 = IsUnion<string>; // false
type case2 = IsUnion<string | number>; // true
type case3 = IsUnion<[string | number]>; // false
```

## 풀이

### 시도 1

> 접근 방식

- 유니온 타입을 튜플로 변환 후, 튜플의 길이 확인
- 튜플의 길이가 1보다 크면 유니온 아닐까?

> 코드

```ts
type UnionToTuple<T, K = T> = [T] extends [never]
  ? []
  : K extends K
    ? [K, ...UnionToTuple<Exclude<T, K>>]
    : never;

type IsUnion<T> = UnionToTuple<T>["length"] extends [any] ? true : false;

type example = UnionToTuple<string | number | boolean>;
```

> 실패 이유

- 튜플이 아니라 퍼머넌트로 나옴

### 시도 2

> 접근 방식

- 분배법칙을 활용해 각 요소에 접근
- 각 요소가 전체 타입(입력받은 `T`)과 같으면 false, 다르면 true

> 코드

```ts
type IsUnion<T, U = T> = [T] extends [never]
  ? false
  : T extends U
    ? [U] extends [T]
      ? false
      : true
    : never;
```

> 코드 설명

- `[T] extends [never]`은 `T`가 `never`인 경우 분기처리
- `T extends U`를 활용해 각 요소를 순회(항상 참인 조건, 분배법칙만을 위한 요소)
- 만약 각 요소와 전체 타입(`U` = 입력받은 `T`)이 같다면 이는 유니온 타입이 아니기 때문에 `false`를 반환
- 각 요소와 전체 타입이 다르다면 이는 유니온 타입이기 때문에 `true`를 반환
