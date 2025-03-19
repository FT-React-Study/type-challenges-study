type Zip<T extends any[], U extends any[]> = T extends [
  infer THead,
  ...infer TRest
]
  ? U extends [infer UHead, ...infer URest]
    ? [[THead, UHead], ...Zip<TRest, URest>]
    : []
  : [];

type Test = Zip<[[1, 2]], [3]>;
type Test2 = Zip<[1, 2, 3], [4]>;
