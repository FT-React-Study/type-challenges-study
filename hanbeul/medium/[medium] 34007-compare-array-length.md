## [medium] 34007. Compare Array Length

> View on GitHub: https://tsch.js.org/34007

#### 문제

Implement `CompareArrayLength` to compare two array length(T & U).

If length of T array is greater than U, return 1;
If length of U array is greater than T, return -1;
If length of T array is equal to U, return 0.

#### 문제 설명

- 두 배열의 길이를 비교하는 문제
- T 배열의 길이가 U 배열의 길이보다 크면 1을 리턴
- U 배열의 길이가 T 배열의 길이보다 크면 -1을 리턴
- 길이가 같으면 0을 리턴

#### 시도 1

> 접근 방식

- 먼저 배열의 길이가 같으면 0을 리턴
- infer로 하나씩 추출해서 먼저 길이가 0이 되는 요소가 나올 때까지 재귀 처리

> 코드

```ts
type CompareArrayLength<
  T extends any[],
  U extends any[]
> = T["length"] extends U["length"]
  ? 0
  : T extends [infer _, ...infer TRest]
  ? U extends [infer _, ...infer URest]
    ? CompareArrayLength<TRest, URest>
    : 1
  : -1;
```

> 코드 설명

- 먼저 배열의 길이가 같으면 0을 리턴
- 그게 아니면 각자 `infer`로 하나씩 추출
- 만약 `U` 배열이 먼저 끝나면 1을 리턴
- 만약 `T` 배열이 먼저 끝나면 -1을 리턴
