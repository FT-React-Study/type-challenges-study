## 21220 - Permutations of Tuple

> View on github: https://tsch.js.org/21220

#### 문제

Given a generic tuple type `T extends unknown[]`, write a type which produces all permutations of `T` as a union.

> 예시

```ts
PermutationsOfTuple<[1, number, unknown]>;
// Should return:
// | [1, number, unknown]
// | [1, unknown, number]
// | [number, 1, unknown]
// | [unknown, 1, number]
// | [number, unknown, 1]
// | [unknown, number ,1]
```

#### 문제 설명

- 튜플의 모든 조합을 반환하는 타입을 작성
- 조합들은 Union으로 반환

#### 시도 1

> 접근 방식

- 기존 순열 코드 차용

> 코드

```ts
type Permutation<T, K = T> = [T] extends [never]
  ? []
  : K extends K
  ? [K, ...Permutation<Exclude<T, K>>]
  : never;

type PermutationsOfTuple<T extends unknown[]> = Permutation<T[number]>;
```

> 실패 이유

- any와 unknown 처리 실패

#### 시도 2 (답지 참고)

> 코드

```ts
type PermutationsOfTuple<
  T extends unknown[],
  Prev extends unknown[] = []
> = T extends [infer First, ...infer Rest]
  ?
      | [First, ...PermutationsOfTuple<[...Prev, ...Rest]>]
      | (Rest extends [] ? never : PermutationsOfTuple<Rest, [...Prev, First]>)
  : [];
```

> 코드 설명

- `T`를 순회하며, `First` 및 `Rest` 분리
- `First`와 `Prev`, `Rest`를 조합
- `Rest`가 빈 배열일 경우 `never` 반환
- 아닐 경우, `Rest`와 `...Prev, First`를 재귀 호출
