## [medium] 9896. Get Middle Element

#### 문제

> View on GitHub: https://tsch.js.org/9896

Get the middle element of the array by implementing a `GetMiddleElement` method, represented by an array

> If the length of the array is odd, return the middle element
> If the length of the array is even, return the middle two elements

> 예시

```ts
  type simple1 = GetMiddleElement<[1, 2, 3, 4, 5]>, // expected to be [3]
  type simple2 = GetMiddleElement<[1, 2, 3, 4, 5, 6]> // expected to be [3, 4]
```

#### 문제 설명

- 배열을 받아, 중간 요소를 반환
- 배열의 길이가 홀수면, 중간 요소를 반환
- 배열의 길이가 짝수면, 중간 두 요소를 반환

#### 시도 1

> 접근 방식

- infer를 활용해 양쪽 요소를 하나씩 제거하면서 중간 요소를 찾음

> 코드

```ts
type GetMiddleElement<T extends any[]> = T extends [
  infer _F,
  ...infer R,
  infer _L
]
  ? GetMiddleElement<R>
  : T;
```

> 코드 설명

- `infer _F`와 `infer _L`은 양쪽 요소를 제거하기 위해 사용
- `...infer R`은 중간 요소를 찾기 위해 사용

> 실패 이유

- 배열의 길이가 짝수일 때는 빈 배열 반환

#### 시도 2 (정답)

> 접근 방식

- 배열의 길이가 2일 때 얼리 리턴

> 코드

```ts
type GetMiddleElement<T extends any[]> = T extends [infer F, infer L]
  ? [F, L]
  : T extends [infer _F, ...infer R, infer _L]
  ? GetMiddleElement<R>
  : T;
```

> 코드 설명

- 배열의 길이가 2일 때(`infer F, infer L`) 얼리 리턴
- 이외에는 양쪽 요소를 하나씩 제거하면서 중간 요소를 찾음
