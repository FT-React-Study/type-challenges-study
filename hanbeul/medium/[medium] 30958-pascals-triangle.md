## [medium] 30958. Pascal's triangle

> View on GitHub: https://tsch.js.org/30958

#### 문제

Given a number N, construct the Pascal's triangle with N rows.

#### 문제 설명

- 파스칼의 삼각형을 타입으로 구현
- 주어진 숫자만큼의 행을 가진 파스칼의 삼각형을 만들어 반환

#### 시도 1 (답지 참조)

> 코드

```ts
type GetLast<T extends number[][]> = T extends [
  ...any,
  infer L extends number[]
]
  ? L
  : never;

type ToTuple<T extends number, R extends number[] = []> = R["length"] extends T
  ? R
  : ToTuple<T, [...R, 0]>;

type Sum<T extends number, U extends number> = [
  ...ToTuple<T>,
  ...ToTuple<U>
]["length"];

type GenRow<T extends number[], R extends number[] = [1]> = T extends [
  infer F extends number,
  infer S extends number,
  ...infer L extends number[]
]
  ? [Sum<F, S>] extends [infer A extends number]
    ? GenRow<[S, ...L], [...R, A]>
    : never
  : [...R, 1];

type Pascal<
  N extends number,
  R extends number[][] = [[1]]
> = R["length"] extends N ? R : Pascal<N, [...R, GenRow<GetLast<R>>]>;
```

> 코드 설명

- 재귀의 깊이가 N과 같아지면, 파스칼의 삼각형(`R`)을 반환
- 그 때까지는 `GenRow` 함수를 통해 파스칼의 삼각형을 만들어 배열에 추가
- `GenRow` 함수는 파스칼의 삼각형의 마지막 행을 가져오고, 이를 더해 새로운 행을 만듦
- 이 과정을 반복하여 파스칼의 삼각형을 완성
