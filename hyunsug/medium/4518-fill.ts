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
