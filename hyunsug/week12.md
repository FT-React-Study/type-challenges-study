# Week 12

## [Medium-4499-Chunk](./medium/4499-chunk.ts)

```ts
type Chunk<
  T extends readonly unknown[],
  N extends number,
  CurrentChunk extends readonly unknown[] = [],
  Result extends readonly unknown[] = []
> = T extends []
  ? CurrentChunk extends []
    ? Result
    : [...Result, CurrentChunk]
  : T extends [infer F, ...infer Rest]
  ? CurrentChunk["length"] extends N
    ? Chunk<Rest, N, [F], [...Result, CurrentChunk]>
    : Chunk<Rest, N, [...CurrentChunk, F], Result>
  : never;
```

- `CurrentChunk`와 `Result`은 빈 배열로 초기화하여 chunk를 분리하는 작업을 진행할 배열과 결과를 저장할 배열로 사용한다.
- 문제는 `T`가 튜플이어야 함을 안내하고 있어 `readonly unknown[]`로 제한을 두었다.
- `T extends []`를 통해 먼저 T가 빈 배열인지 확인한다.
- 만일 빈 배열이라면 일단 `CurrentChunk`가 빈 배열인지를 확인한다.
- `CurrentChunk`도 빈 배열이라면, 빈 배열을 받았거나 모든 분리가 완료되어 `Result`에 저장된 경우이므로 `Result`을 반환한다.
- 다만 `T`는 비었으나, `CurrentChunk`가 빈 배열이 아니라면, chunk 크기에 도달하지 못한 마지막 `CurrentChunk`이므로 이를 Result에 추가하여 반환한다.
- `T`가 비어있지 않다면 앞에서부터 하나씩 떼어내고, `CurrentChunk`에 넣기 위해 현재 `CurrentChunk`의 길이가 `N`과 같은지 확인한다.
- `CurrentChunk`에 넣을 수 있는 경우는 `CurrentChunk`에 추가하고 다음 요소로 넘어간다.
- `CurrentChunk`에 넣을 수 없는, `CurrentChunk`가 지정된 청크 사이즈가 된 경우, 이를 `Result`에 추가하고 `CurrentChunk`는 새로운 인자를 담아 초기화하고 이를 반복한다.
- 마지막 `never`는 도달할 수 없는 조건절임을 명시했다.

## [Medium-4518-Fill](./medium/4518-fill.ts)

```ts
type Fill<
  T extends readonly unknown[],
  N,
  Start extends number = 0,
  End extends number = T["length"],
  IsStart extends boolean = false,
  Result extends readonly unknown[] = []
> = T extends [infer F, ...infer Rest]
  ? Start extends End
    ? [...Result, ...T]
    : IsStart extends false
    ? Result["length"] extends Start
      ? Fill<Rest, N, Start, End, true, [...Result, N]>
      : Fill<Rest, N, Start, End, false, [...Result, F]>
    : Result["length"] extends End
    ? [...Result, ...T]
    : Fill<Rest, N, Start, End, true, [...Result, N]>
  : Result;
```

- `IsStart` 플래그를 추가하여 `Start`에서 교체가 시작되었는지 확인한다.
- `Result`는 빈 배열로 초기화하여 결과값을 담을 배열로 사용한다.
- `T`가 완전히 빈 배열이 된다면 `Result`를 반환한다. (마지막 줄, 탈출 조건)
- 먼저 `T`를 첫 요소와 나머지로 나눈다. `Start`와 `End`가 동일한 수인 경우 교체가 일어나지 않으므로 그대로 반환한다.
- `IsStart`가 false이면서, `Result["length"]`가 Start와 같아진 경우 `F` 대신 `N`을 넣고 재귀를 진행한다.
- `IsStart`가 true이면서, `Result["length"]`가 End와 같아진 경우는 모든 교체가 끝난 것이므로 `Result`를 반환하되, `T`에 남은 요소가 있을 수 있으므로 이를 함께 반환한다.
- `IsStart`가 true이면서, `Result["length"]`가 End와 같지 않다면 계속 교체를 진행한다.

## [Medium-4803-TrimRight](./medium/4803-trim-right.ts)

```ts
type Space = " " | "\n" | "\t";
type TrimRight<S extends string> = S extends `${infer Rest}${Space}`
  ? TrimRight<Rest>
  : S;
```

- [TrimLeft](./medium/106-trim-left.ts) 문제와 유사하다.
- 동일하게 `Space` 타입을 정의하고, 이번엔 문자열의 뒤에서 `Space` 템플릿 리터럴 매칭을 통해 재귀를 진행하여 `Space`가 없을 때까지 반복한다.

## [Medium-5117-Without](./medium/5117-without.ts)

```ts
type CreateUnion<
  T extends number | unknown[],
  Union extends any[] = []
> = T extends number
  ? T
  : T extends [infer F, ...infer Rest]
  ? CreateUnion<Rest, [...Union, F]>
  : Union[number];

type Without<
  T extends readonly any[],
  U extends number | any[],
  Union extends any[] = CreateUnion<U>
> = T extends [infer F, ...infer Rest]
  ? F extends Union
    ? Without<Rest, U, Union>
    : [F, ...Without<Rest, U, Union>]
  : T;
```

- `lodash`의 `without` 함수는 Array에서 특정 요소들을 제거하는 함수이다.
- `CreateUnion` 타입은 `U`의 요소들을 Union 타입으로 변환한다.
- `Without`의 `T`는 배열로 주어지기에 `[infer F, ...infer Rest]`로 나누어 재귀를 진행한다.
- `F`가 `Union`에 속하는지 확인하고 속한다면 제외한 나머지 배열에 대해 진행하고, 속하지 않는다면 결과에 포함시킨다.
- 마지막으로 `T`가 빈 배열이 되면 모든 재귀가 끝난 것이므로 결과를 반환한다.

## [Medium-5140-Trunc](./medium/5140-trunc.ts)

## [Medium-5153-IndexOf](./medium/5153-indexof.ts)
