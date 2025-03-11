type FlattenOnce<T extends readonly any[]> = T extends [
  infer First,
  ...infer Rest
]
  ? First extends readonly any[]
    ? [...First, ...FlattenOnce<Rest>]
    : [First, ...FlattenOnce<Rest>]
  : T;

type FlattenDepth<
  T extends readonly any[],
  Depth extends number = 1,
  Count extends any[] = []
> = Count["length"] extends Depth
  ? T
  : T extends [infer First, ...infer Rest]
  ? First extends readonly any[]
    ? [
        ...FlattenDepth<First, Depth, [...Count, 1]>,
        ...FlattenDepth<Rest, Depth, Count>
      ]
    : [First, ...FlattenDepth<Rest, Depth, Count>]
  : T;

type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>; // [1, 2, 3, 4, [5]]. flattern 2 times
type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]>; // [1, 2, 3, 4, [[5]]]. Depth defaults to be 1
