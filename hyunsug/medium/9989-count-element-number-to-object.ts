type DeepFlat<T extends any[]> = T extends [infer F, ...infer Rest]
  ? F extends any[]
    ? [...DeepFlat<F>, ...DeepFlat<Rest>]
    : [F, ...DeepFlat<Rest>]
  : [];

type GetObjectWithLength<T extends { [key: keyof any]: readonly unknown[] }> = {
  [key in keyof T]: T[key] extends readonly unknown[]
    ? T[key]["length"]
    : never;
};

type CountElementNumberToObject<
  T extends any[],
  FT extends any[] = DeepFlat<T>,
  Base extends { [key: keyof any]: unknown[] } = { [key in FT[number]]: [] }
> = T extends [never]
  ? {}
  : FT extends [infer F, ...infer Rest]
  ? F extends keyof Base
    ? CountElementNumberToObject<
        [],
        Rest,
        {
          [key in keyof Base]: key extends F
            ? [...Base[key], unknown]
            : Base[key];
        }
      >
    : CountElementNumberToObject<[], Rest, Base>
  : GetObjectWithLength<Base>;
