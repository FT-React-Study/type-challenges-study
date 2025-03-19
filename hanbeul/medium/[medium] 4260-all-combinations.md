## [medium] 4260. All Combinations

#### 문제

문자열 `S`의 문자들을 최대 한 번씩만 사용하여 만들 수 있는 모든 문자열 조합을 반환하는 `AllCombinations<S>` 타입을 구현하세요.

> 예시

```ts
type AllCombinations_ABC = AllCombinations<"ABC">;
// 결과값: '' | 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BA' | 'BC' | 'CA' | 'CB' | 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA'
```

#### 시도 1

> 접근 방법

- 우선 문자열을 union으로 변환
- union을 기반으로 permutation 생성
- 생성된 요소들을 다시 합쳐 string으로 변환

> 코드

```ts
type StringToTuple<S extends String> = S extends `${infer First}${infer Last}`
  ? [First, ...StringToTuple<Last>]
  : [];

type StringToUnion<S extends string> = StringToTuple<S>[number];

type Permutation<T extends string[], K = T> = [T] extends [never]
  ? []
  : K extends K
  ? [K, ...Permutation<Exclude<T, K>>]
  : never;

type Join<T extends string[]> = T extends [
  infer First extends string,
  ...infer Rest extends string[]
]
  ? `${First}${Join<Rest>}`
  : "";

type AllCombinations<
  S extends string,
  P = Permutation<StringToUnion<S>>
> = P extends P ? Join<P> : never;
```

> 코드 설명

- `StringToTuple` 함수는 문자열을 튜플로 변환
- `StringToUnion` 함수는 튜플을 union으로 변환
- `Permutation` 함수는 주어진 배열의 순열을 생성
- `Join` 함수는 배열을 문자열로 결합

> 실패 이유

- `Permutation`을 활용하면 안됨
- 왜냐하면 모든 요소를 사용한 조합만 볼 수 있음
- 예를 들어 `ABC`의 경우 `ABC`, `ACB`, `BAC`, `BCA`, `CAB`, `CBA` 이렇게 6개의 요소만 확인 가능
- 하지만 `Exclude`를 활용해 접근하는 방식은 맞을 듯

#### 시도 2 (답지 확인)

> 코드

```ts
type StringToUnion<S extends string> = S extends `${infer L}${infer R}`
  ? L | StringToUnion<R>
  : S;

type Combination<A extends string, B extends string> =
  | A
  | B
  | `${A}${B}`
  | `${B}${A}`;

type UnionCombination<A extends string, B extends string = A> = A extends B
  ? Combination<A, UnionCombination<Exclude<B, A>>>
  : never;

type AllCombinations<S extends string> = UnionCombination<StringToUnion<S>>;
```

> 코드 설명

- `StringToUnion` 함수는 문자열을 union으로 변환 ('' 포함)
- `Combination` 함수는 두 문자열을 이용해 조합 생성
- `UnionCombination` 함수는 string union으로 들어온 `A`를 순회하며, 각 요소와 해당 요소를 제외한 union을 재귀적으로 호출하여 조합 생성
- `AllCombinations` 함수는 `UnionCombination` 함수를 활용하여 모든 문자열 조합을 반환

#### 새롭게 배운 점

> `StringToUnion` 함수 구현 방식

```ts
type StringToUnion<S extends string> = S extends `${infer L}${infer R}`
  ? L | StringToUnion<R>
  : S;
```

- template literal의 infer 구문을 활용해 문자열을 분리하고, 이를 재귀적으로 처리
