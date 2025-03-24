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
