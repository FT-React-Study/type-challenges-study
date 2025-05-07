type CartesianProduct<T, U> = T extends infer TItem
  ? U extends infer UItem
    ? [TItem, UItem]
    : never
  : never;
