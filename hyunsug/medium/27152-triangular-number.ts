type Triangular<
  N extends number,
  C extends unknown[] = [],
  R extends unknown[] = []
> = C["length"] extends N
  ? R["length"]
  : Triangular<N, [...C, unknown], [...R, ...C, unknown]>;
