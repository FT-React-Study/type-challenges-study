type FalsyLiteral =
  | 0
  | ""
  | false
  | []
  | undefined
  | null
  | { [key: keyof any]: never };

type AnyOf<T extends any[], Result extends boolean = false> = T extends [
  infer F,
  ...infer R
]
  ? F extends FalsyLiteral
    ? Result extends true
      ? Result
      : AnyOf<R, false>
    : AnyOf<R, true>
  : Result;

type Sample1 = AnyOf<[1, "", false, [], {}]>; // expected to be true.
type Sample2 = AnyOf<[0, "", false, [], {}]>; // expected to be false.

type AnyOfTest1 = AnyOf<
  [1, "test", true, [1], { name: "test" }, { 1: "test" }]
>; // true
type AnyOfTest2 = AnyOf<[1, "", false, [], {}]>; // true
type AnyOfTest3 = AnyOf<[0, "test", false, [], {}]>; // true
type AnyOfTest4 = AnyOf<[0, "", true, [], {}]>; // true
type AnyOfTest5 = AnyOf<[0, "", false, [1], {}]>; // true
type AnyOfTest6 = AnyOf<[0, "", false, [], { name: "test" }]>; // true
type AnyOfTest7 = AnyOf<[0, "", false, [], { 1: "test" }]>; // true
type AnyOfTest8 = AnyOf<[0, "", false, [], { name: "test" }, { 1: "test" }]>; // true
type AnyOfTest9 = AnyOf<[0, "", false, [], {}, undefined, null]>; // false
type AnyOfTest10 = AnyOf<[]>; // false
