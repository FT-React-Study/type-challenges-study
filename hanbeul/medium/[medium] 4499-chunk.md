## [medium] 4499. Chunk

#### 문제

주어진 배열을 특정 길이의 청크로 나누는 문제입니다.

`lodash`를 아시나요? `Chunk`는 lodash에서 매우 유용한 함수입니다. 이제 이것을 구현해보겠습니다.
`Chunk<T, N>`는 두 개의 필수 타입 매개변수를 받습니다. `T`는 반드시 `튜플`이어야 하고, `N`은 반드시 `1 이상의 정수`여야 합니다.

> 예시

```ts
type exp1 = Chunk<[1, 2, 3], 2>; // 예상 결과: [[1, 2], [3]]
type exp2 = Chunk<[1, 2, 3], 4>; // 예상 결과: [[1, 2, 3]]
type exp3 = Chunk<[1, 2, 3], 1>; // 예상 결과: [[1], [2], [3]]
```

> 문제 설명

- 이 문제는 주어진 배열을 특정 길이의 청크(배열)로 나누는 타입을 구현
- 주어진 배열이 튜플인지 확인하고, 청크의 길이(N)가 1 이상인지 확인
- 청크의 길이가 배열의 길이보다 클 경우, 배열 자체를 반환

#### 시도 1 (정답)

> 접근 방법

- 두 개의 배열을 만들어서, 하나는 청크를 만들고 하나는 청크를 채워나가는 방식
- 청크를 채워나가는 배열의 길이가 N과 같아지면, 청크를 만들어주는 배열에 추가
- 이후 재귀로 나머지 요소들에 대해서도 같은 작업을 반복

> 코드

```ts
type Chunk<
  T extends any[],
  N extends Number,
  Result extends any[] = [],
  Chunk extends any[] = []
> = T extends [infer First, ...infer Rest]
  ? Chunk["length"] extends N
    ? Chunk<Rest, N, [...Result, Chunk], [First]>
    : Chunk<Rest, N, Result, [...Chunk, First]>
  : Chunk["length"] extends 0
  ? Result
  : [...Result, Chunk];
```

> 코드 설명

- `Result`는 최종적으로 반환될 배열(`Chunk[]`)
- `Chunk`는 청크를 채워나가는 배열
- `T`를 재귀적으로 탐색하면서, `Chunk`에 채워넣기
- `Chunk`의 길이가 `N`과 같아지면, `Result`에 추가
- 이후 재귀로 나머지 요소들에 대해서도 같은 작업을 반복
