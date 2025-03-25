type Trunc<T extends string | number> =
  `${T}` extends `${infer Integer}.${infer _}`
    ? Integer extends ""
      ? "0"
      : Integer extends `-`
      ? "-0"
      : Integer
    : `${T}`;
