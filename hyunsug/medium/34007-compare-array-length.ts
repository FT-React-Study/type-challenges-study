type CompareArrayLength<T extends any[], U extends any[]> = [T, U] extends [
  [infer _, ...infer TRest],
  [infer _, ...infer URest]
]
  ? CompareArrayLength<TRest, URest>
  : [T, U] extends [[], []]
  ? 0
  : T extends []
  ? -1
  : 1;
