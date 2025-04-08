type GetMiddleElement<T> = T extends [infer F, ...infer R, infer L]
  ? R extends []
    ? [F, L]
    : GetMiddleElement<R>
  : T;
