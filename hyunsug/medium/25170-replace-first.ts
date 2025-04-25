type ReplaceFirst<
  T extends readonly unknown[],
  S,
  R,
  Pre extends unknown[] = []
> = T extends [infer F, ...infer Rest]
  ? F extends S
    ? [...Pre, R, ...Rest]
    : ReplaceFirst<Rest, S, R, [...Pre, F]>
  : Pre;
