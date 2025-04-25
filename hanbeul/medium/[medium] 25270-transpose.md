## [medium] 25270. Transpose

> View on github: https://tsch.js.org/25270

#### 문제

The transpose of a matrix is an operator which flips a matrix over its diagonal; that is, it switches the row and column indices of the matrix A by producing another matrix, often denoted by A<sup>T</sup>.

> 예시

```ts
type Matrix = Transpose<[[1]]>; // expected to be [[1]]
type Matrix1 = Transpose<[[1, 2], [3, 4]]>; // expected to be [[1, 3], [2, 4]]
type Matrix2 = Transpose<[[1, 2, 3], [4, 5, 6]]>; // expected to be [[1, 4], [2, 5], [3, 6]]
```

#### 문제 설명

- 행렬의 전치 연산을 수행
- 행렬의 행과 열을 바꾸어 새로운 행렬을 생성

#### 시도 1

> 접근 방식

- 일단 눈물 좀 닦고...
- 행렬을 순회하면서, 각 행의 요소들을 모아서 새로운 행렬을 생성
- 이후 내부 행렬을 infer로 분리해서 같은 index로 모아서 새로운 행렬 생성

> 코드

```ts
type GetElementByIndex<
  T extends any[],
  Idx extends number,
  Cnt extends any[] = []
> = T extends [infer First, ...infer Rest]
  ? Cnt["length"] extends Idx
    ? First
    : GetElementByIndex<Rest, Idx, [...Cnt, unknown]>
  : never;

type PickColumn<M extends any[][], Idx extends number> = {
  [K in keyof M]: GetElementByIndex<M[K], Idx>;
};

type Transpose<M extends number[][]> = M extends [
  infer FirstRow extends any[],
  ...any
]
  ? { [K in keyof FirstRow]: PickColumn<M, Extract<K, number>> }
  : [];
```

> 코드 설명

- `GetElementByIndex`는 행렬의 요소를 인덱스로 조회하는 함수
- `PickColumn`은 행렬의 열을 추출하는 함수
- `Transpose`는 행렬의 전치 연산을 수행하는 함수

> 실패 이유

- 모두 `never`로 리턴

#### 시도 2 (답지 참고)

> 접근 방식

> 코드

```ts
type Transpose<M extends number[][], R = M["length"] extends 0 ? [] : M[0]> = {
  [X in keyof R]: {
    [Y in keyof M]: X extends keyof M[Y] ? M[Y][X] : never;
  };
};
```

> 코드 설명

- 우선 `R`로 행렬의 첫 번째 행을 가져옴
- 이후 첫 번째 행을 순회하며, 각 키 값들을 바탕으로 새로운 열을 만듦
- 새로운 열에는 `M[Y][X]` 형식으로 값을 넣어줌
- 이후 새로운 열을 배열로 묶어서 리턴
