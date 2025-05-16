## [medium] 27958. Check Repeated Tuple

> View on GitHub: https://tsch.js.org/27958

#### 문제

Implement type `CheckRepeatedChars<T>` which will return whether type `T` contains duplicated member

> 예시

```ts
type CheckRepeatedTuple<[1, 2, 3]>   // false
type CheckRepeatedTuple<[1, 2, 1]>   // true
```

#### 문제 설명

- 튜플에 중복된 요소가 있는지 확인하는 문제

#### 시도 1

> 접근 방식

- 전체 요소 순회 후, 각 요소를 비교하여 중복된 요소가 있는지 확인

> 코드

```ts
type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type IsRepeat<T extends unknown[], El, Cnt extends unknown[] = []> = T extends [
  infer First,
  ...infer Rest
]
  ? IsEqual<First, El> extends true
    ? IsRepeat<Rest, El, [...Cnt, unknown]>
    : IsRepeat<Rest, El, Cnt>
  : Cnt["length"] extends 1
  ? false
  : true;

type CheckRepeatedTuple<T extends unknown[]> = T extends [
  infer First,
  ...infer Rest
]
  ? IsRepeat<T, First> extends true
    ? true
    : CheckRepeatedTuple<Rest>
  : false;
```

> 코드 설명

- `IsEqual<X, Y>` : 두 요소가 같은지 확인
- `IsRepeat<T, First>` : 현재 요소와 이전 결과를 비교하여 중복된 요소가 있는지 확인(전체 요소에 존재하는 현재 요소의 개수가 1개인지 확인)
- `CheckRepeatedTuple<T>` : 전체 요소를 순회하며 중복된 요소가 있는지 확인, 중복된 요소가 있으면 `true`, 없으면 다음 요소 확인
