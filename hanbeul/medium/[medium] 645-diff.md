# 645-diff

## 문제

`O` & `O1`의 차이점인 `객체`를 가져옵니다

> 예시

```ts
import type { Equal, Expect } from "@type-challenges/utils";

type Foo = {
  name: string;
  age: string;
};
type Bar = {
  name: string;
  age: string;
  gender: number;
};
type Coo = {
  name: string;
  gender: number;
};

type cases = [
  Expect<Equal<Diff<Foo, Bar>, { gender: number }>>,
  Expect<Equal<Diff<Bar, Foo>, { gender: number }>>,
  Expect<Equal<Diff<Foo, Coo>, { age: string; gender: number }>>,
  Expect<Equal<Diff<Coo, Foo>, { age: string; gender: number }>>,
];
```

## 풀이

### 시도 1

> 접근 방식

- A 객체의 키를 순회하며 B 객체에 extends가 안될 경우 빈 객체에 키-값 쌍 추가
- 마찬가지로 B 객체에 A 객체에 extends가 안될 경우 빈 객체에 키-값 쌍 추가
- 위 두 객체의 결과를 유니온한 뒤 객체로 리턴

> 코드

```ts
type GetDiff<A, B> = { [K in keyof A]: A[K] extends B ? A[K] : never };

type Diff<O, O1, DiffIntersection = GetDiff<O, O1> & GetDiff<O1, O>> = {
  [K in keyof DiffIntersection]: DiffIntersection[K];
};

type example1 = Diff<Foo, Bar>;
// { name: never; age: never; gender: never; }
```

> 실패 이유

- value가 never가 되는건 속성을 없애지는 않아서 `key: never`로 처리됨

### 시도 2

> 접근 방식

- 시도 1과 접근 방식은 동일, as(key-remapping)을 활용해 value가 아니라 key값을 never 처리하도록 변경

> 코드

```ts
type GetDiff<A, B> = { [K in keyof A as K extends keyof B ? never : K]: A[K] };

type Diff<O, O1, DiffIntersection = GetDiff<O, O1> & GetDiff<O1, O>> = {
  [K in keyof DiffIntersection]: DiffIntersection[K];
};
```

> 코드 설명

- `GetDiff` 함수는 첫번째 인자의 키를 순회하며 두번째 인자에 포함되지 않는 키를 `never`로 처리한 객체를 리턴
- `DiffIntersection`은 `GetDiff<A, B>`와 `GetDiff<B, A>`의 유니온 객체
- 이후 `DiffIntersection`의 키를 순회하며 각 키의 값을 리턴
