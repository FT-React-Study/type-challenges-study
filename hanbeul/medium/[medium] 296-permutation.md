# 296 - Permutation

> View on GitHub: https://tsch.js.org/296

## 문제

주어진 유니언 타입을 순열 배열로 바꾸는 `Permutation` 타입을 구현하세요.

## 정답

```ts
type Permutation<T, K = T> = [T] extends [never]
  ? []
  : K extends K
    ? [K, ...Permutation<Exclude<T, K>>]
    : never;
```

## 설명

1. `<T, K = T>`: `T`를 기본값으로 설정하는 변수 `K` 생성

   - `K extends K`에서 유니온 분배를 위해 사용

2. `[T] extends [never]`: `T`가 `never`인 경우를 체크

   - `T`가 `never`인 경우, 빈 배열을 반환해서 순열 생산 종료 (재귀 종료)
   - `T extends never`를 사용하지 않는 이유는 분배법칙을 막기 위해서

3. `K extends K`: `T`와 동일한 `K`를 유니온 분배하여 순회

   - `K`(유니온)를 순회하며 각 요소에 대해 재귀 호출

4. `[K, ...Permutation<Exclude<T, K>>]`: `K`를 제외한 `T`의 순열을 구하는 재귀 호출

   - `K extends K`에서 분배된 요소를 순회하며 재귀 호출
   - `Exclude<T, K>`: `T`에서 `K`를 제외한 타입으로 재귀 호출

```ts
type Test = Permutation<"A" | "B" | "C">;

// 1단계: K = 'A'
// 결과: ['A', ...Permutation<'B' | 'C'>]

// 2단계: K = 'B'
// 결과: ['B', ...Permutation<'A' | 'C'>]

// 3단계: K = 'C'
// 결과: ['C', ...Permutation<'A' | 'B'>]
```

## 추가 질문

> `K extends K` 제대로 이해하기

- `K extends K`는 항상 참이므로, 결국 모든 유니온 분배를 트리거하는 역할

```ts
type Test<K> = K extends K ? [K] : never;

type Result = Test<"A" | "B" | "C">;
```

- 이 예시의 경우 다음과 같이 동작함

```ts
'A' extends 'A' ? ['A'] : never → ['A']
'B' extends 'B' ? ['B'] : never → ['B']
'C' extends 'C' ? ['C'] : never → ['C']
```

- 그리고 해당 결과를 유니온으로 합쳐 `['A'] | ['B'] | ['C']` 반환

- 만약 분배법칙을 적용하지 않으려면 `K`를 배열로 감싸서 `[K]`로 표현해야 함

```ts
type NoDistribute<K> = [K] extends [K] ? [K] : never;

type Result = NoDistribute<"A" | "B" | "C">;
// Result는 ['A' | 'B' | 'C']
```

## Reference

- [Github Answer](https://github.com/type-challenges/type-challenges/issues/614)
