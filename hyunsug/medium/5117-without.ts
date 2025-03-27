type CreateUnion<
  T extends number | unknown[],
  Union extends any[] = []
> = T extends number
  ? T
  : T extends [infer F, ...infer Rest]
  ? CreateUnion<Rest, [...Union, F]>
  : Union[number];

type Without<
  T extends readonly any[],
  U extends number | any[],
  Union extends any[] = CreateUnion<U>
> = T extends [infer F, ...infer Rest]
  ? F extends Union
    ? Without<Rest, U, Union>
    : [F, ...Without<Rest, U, Union>]
  : T;
