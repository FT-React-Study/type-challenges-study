type Join<
  T extends (string | number)[],
  U extends string | number = ","
> = T extends []
  ? ""
  : T extends [infer F extends string | number]
  ? `${F}`
  : T extends [
      infer F extends string | number,
      ...infer R extends (string | number)[]
    ]
  ? `${F}${U}${Join<R, U>}`
  : never;
