type FindAll<
  T extends string,
  P extends string,
  C extends unknown[] = [],
  Result extends number[] = []
> = T extends ""
  ? P extends ""
    ? []
    : Result
  : P extends ""
  ? []
  : T extends `${infer _}${infer R}`
  ? T extends `${P}${infer _}`
    ? FindAll<R, P, [...C, unknown], [...Result, C["length"]]>
    : FindAll<R, P, [...C, unknown], Result>
  : Result;
