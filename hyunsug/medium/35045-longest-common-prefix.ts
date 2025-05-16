type CommonPrefix<
  A extends string,
  B extends string
> = A extends `${infer F}${infer RestOfA}`
  ? B extends `${F}${infer RestOfB}`
    ? `${F}${CommonPrefix<RestOfA, RestOfB>}`
    : ""
  : "";

type LongestCommonPrefix<T extends string[]> = T extends [
  infer A extends string,
  infer B extends string,
  ...infer Rest extends string[]
]
  ? LongestCommonPrefix<[CommonPrefix<A, B>, ...Rest]>
  : T extends [infer Only extends string]
  ? Only
  : "";
