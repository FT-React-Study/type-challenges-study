## [medium] 35191. Trace

> View on GitHub: https://tsch.js.org/35191

#### 문제

The trace of a square matrix is the sum of the elements on its main diagonal.
However, it's difficult to calculate the sum with type system.
To make things simple, let's return the elements on the main diagonal with union type.

> 예시

```ts
type Arr = [[1, 2], [3, 4]];
type Test = Trace<Arr>; // expected to be 1 | 4
```

#### 문제 설명

- 정사각형 행렬의 대각선 요소들의 유니온 타입을 반환하는 타입을 구현

#### 시도 1

> 접근 방식

- 기존 25270-Transpose 문제에서 행렬 전치 타입을 구현한 것을 참고
- 전치 타입을 구현할 때 행렬의 행과 열의 인덱스가 같은 경우만 유니온 타입을 반환하도록 했음
- 이를 응용해 대각선 요소들의 유니온 타입을 반환하도록 함

> 코드

```ts
type Trace<T extends any[][], R = T["length"] extends 0 ? [] : T[0]> = {
  [X in keyof R]: {
    [Y in keyof T]: X extends Y ? T[Y][Y] : never;
  };
};
```

> 실패 이유

- `T[Y][Y]` 에러 ('Y' 형식을 인덱스 형식 'T[Y]'에 사용할 수 없습니다.)

#### 시도 2 (정답)

> 접근 방식

- 그냥 인덱스를 활용해서 처리해보자

> 코드

```ts
type Trace<
  T extends any[][],
  IndexArr extends unknown[] = [],
  R = never
> = IndexArr["length"] extends T["length"]
  ? R
  : Trace<
      T,
      [...IndexArr, unknown],
      R | T[IndexArr["length"]][IndexArr["length"]]
    >;
```

> 코드 설명

- `IndexArr` 타입을 활용해 행렬의 인덱스를 순회, `IndexArr`의 길이가 `T`의 길이와 같아지면 종료
- `T[IndexArr["length"]][IndexArr["length"]]` 타입을 활용해 대각선 요소 타입 반환
- 재귀를 통해 대각선 요소들의 유니온 타입을 반환
