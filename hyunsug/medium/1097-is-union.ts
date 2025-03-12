type IsUnion<T, U = T> = T extends any
  ? [U] extends [T]
    ? false
    : true
  : never;

type case1 = IsUnion<string>; // false
type case2 = IsUnion<string | number>; // true
type case3 = IsUnion<[string | number]>; // false

type IsUnionTest1 = IsUnion<string>; // false
type IsUnionTest2 = IsUnion<string | number>; // true
type IsUnionTest3 = IsUnion<"a" | "b" | "c" | "d">; // true
type IsUnionTest4 = IsUnion<undefined | null | void | "">; // true
type IsUnionTest5 = IsUnion<{ a: string } | { a: number }>; // true
type IsUnionTest6 = IsUnion<{ a: string | number }>; // false
type IsUnionTest7 = IsUnion<[string | number]>; // false
// Cases where T resolves to a non-union type.
type IsUnionTest8 = IsUnion<string | never>; // false
type IsUnionTest9 = IsUnion<string | unknown>; // false
type IsUnionTest10 = IsUnion<string | any>; // false
type IsUnionTest11 = IsUnion<string | "a">; // false
type IsUnionTest12 = IsUnion<never>; // false
