## [medium] 4471. zip

#### 문제

이 챌린지에서는 Zip<T, U> 타입을 구현해야 합니다. 여기서 T와 U는 반드시 Tuple 이어야 합니다.

> 예시

```ts
type exp = Zip<[1, 2], [true, false]>; // expected to be [[1, true], [2, false]]
```

> 문제 설명

- 이 문제는 두 개의 튜플을 받아서 각각의 같은 위치에 있는 요소들을 쌍으로 묶어 새로운 튜플을 만드는 타입을 구현

#### 시도 1 (정답)

> 접근 방법

- 두 개의 튜플의 맨 앞자리를 infer로 추출해서, 둘 다 존재할 경우 새로운 튜플에 추가로 넣어주기
- 이후 재귀로 나머지 요소들에 대해서도 같은 작업을 반복

> 코드

```ts
type Zip<T extends any[], U extends any[]> = T extends [
  infer TFirst,
  ...infer TRest
]
  ? U extends [infer UFirst, ...infer URest]
    ? [[TFirst, UFirst], ...Zip<TRest, URest>]
    : []
  : [];
```

> 코드 설명

- 두 개의 튜플에 모두 첫번째 요소가 존재할 경우, 두 요소를 묶은 튜플을 만들고, 이후 재귀로 나머지 요소들에 대해서도 같은 작업을 반복
- 만약 둘 중에 하나라도 첫번째 요소가 비어있을 경우(길이가 다를 경우), 빈 배열을 반환하여 재귀 종료
