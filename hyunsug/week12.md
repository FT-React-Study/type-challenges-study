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

## [Medium-4803-TrimRight](./medium/4803-trim-right.ts)

## [Medium-5117-Without](./medium/5117-without.ts)

## [Medium-5140-Trunc](./medium/5140-trunc.ts)

## [Medium-5153-IndexOf](./medium/5153-indexof.ts)
