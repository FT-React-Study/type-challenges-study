type Same<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? 1
  : 2;

type All<T extends readonly unknown[], K> = T extends [infer F, ...infer R]
  ? Same<F, K> extends true
    ? All<R, K>
    : false
  : true;
