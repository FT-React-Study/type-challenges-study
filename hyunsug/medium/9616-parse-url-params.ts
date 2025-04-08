type ParseUrlParams<T> = T extends `${string}:${infer R}`
  ? R extends `${infer P}/${infer RR}`
    ? P | ParseUrlParams<RR>
    : R
  : never;
