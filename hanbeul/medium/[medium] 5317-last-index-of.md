## [medium] 5317. Last Index Of

#### 문제

Implement the type version of `Array.lastIndexOf`, `LastIndexOf<T, U>` takes an Array `T`, any `U` and returns the index of the last `U` in Array `T`

```typescript
type Res1 = LastIndexOf<[1, 2, 3, 2, 1], 2>; // 3
type Res2 = LastIndexOf<[0, 0, 0], 2>; // -1
```

#### 문제 설명

- `Array.lastIndexOf()` 메서드를 타입 레벨에서 구현
- 배열 `T`와 값 `U`를 받아서, 배열의 마지막 `U`의 인덱스를 반환

#### 제한 사항

- `T`는 배열
- `U`는 배열의 요소 타입

#### 시도 1 (정답)

> 접근 방식

- 기존에 사용한 `indexof` 로직을 활용
- index를 만날 때마다 `result`에 저장
- 마지막까지 다 돌고 나서 `result` 반환

> 코드

```ts
type MyEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type LastIndexOf<
  T extends any[],
  U,
  IndexArr extends unknown[] = [],
  Result = -1
> = T extends [infer First, ...infer Rest]
  ? MyEqual<First, U> extends true
    ? LastIndexOf<Rest, U, [...IndexArr, unknown], IndexArr["length"]>
    : LastIndexOf<Rest, U, [...IndexArr, unknown], Result>
  : Result;
```

> 코드 설명

- `T`를 infer로 분리하여 첫번째 요소와 나머지 요소로 분리
- `MyEqual`을 통해 첫번째 요소와 `U`를 비교
- 같으면 `IndexArr`의 길이를 `Result`에 저장
- 재귀를 돌 때마다 `IndexArr`에 `unknown` 추가(`IndexArr`의 길이가 곧 해당 요소의 `index`)
- 마지막까지 돌고 나서 `Result` 반환
