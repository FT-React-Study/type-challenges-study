type ConstructTuple<
  L extends number,
  T extends unknown[] = []
> = T["length"] extends L ? T : ConstructTuple<L, [unknown, ...T]>;
