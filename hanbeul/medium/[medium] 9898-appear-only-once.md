## [medium] 9898. Appear Only Once

> View on GitHub: https://tsch.js.org/9898

#### 문제

Find the elements in the target array that appear only once. For example：input: `[1,2,2,3,3,4,5,6,6,6]`，ouput: `[1,4,5]`.

#### 문제 설명

- 배열을 받아, 중복되지 않는 요소를 반환

#### 시도 1 (정답)

> 접근 방식

- 배열을 순회하면서, 각 요소가 몇 번 나오는지 카운트
- 카운트가 1인 요소만 배열로 반환

> 코드

```ts
type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type IsUniqueInArray<
  T extends any[],
  E,
  CountArr extends unknown[] = []
> = T extends [infer First, ...infer Rest]
  ? IsEqual<First, E> extends true
    ? IsUniqueInArray<Rest, E, [...CountArr, unknown]>
    : IsUniqueInArray<Rest, E, CountArr>
  : CountArr["length"] extends 1
  ? true
  : false;

type FindEles<
  T extends any[],
  Original extends any[] = T,
  Result extends any[] = []
> = T extends [infer First, ...infer Rest]
  ? IsUniqueInArray<Original, First> extends true
    ? FindEles<Rest, Original, [...Result, First]>
    : FindEles<Rest, Original, Result>
  : Result;
```

> 코드 설명

- 이번에도 역시나 general type을 정확히 비교하기 위해 기존에 사용한 `isEqual` 함수를 사용
- 배열을 순회하며, 각 요소가 몇 번 나오는지 확인
- 카운트가 1인 요소만 배열로 반환
