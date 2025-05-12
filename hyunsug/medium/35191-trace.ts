type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N ? Acc : Enumerate<N, [...Acc, Acc["length"]]>;

type Trace<
  T extends any[][],
  Indexes extends number[] = Enumerate<T["length"]>
> = {
  [K in keyof Indexes]: T[Indexes[K]][Indexes[K]];
}[number];
