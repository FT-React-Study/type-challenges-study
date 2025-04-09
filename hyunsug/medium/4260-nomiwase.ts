type StringToUnion<S extends string> = S extends `${infer F}${infer R}`
  ? F | StringToUnion<R>
  : never;

type AllCombinations<S extends string, U extends string = StringToUnion<S>> = [
  U
] extends [never]
  ? ""
  : "" | { [K in U]: `${K}${AllCombinations<never, Exclude<U, K>>}` }[U];
