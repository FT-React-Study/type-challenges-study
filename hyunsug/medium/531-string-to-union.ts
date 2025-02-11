type StringToUnion<
  T extends string,
  U extends string = never
> = T extends `${infer First}${infer Rest}`
  ? First | StringToUnion<Rest, U>
  : U;

type Test = "123";
type Result = StringToUnion<Test>; // expected to be "1" | "2" | "3"

type STUTest1 = StringToUnion<"">; // never
type STUTest2 = StringToUnion<"t">; // "t"
type STUTest3 = StringToUnion<"hello">; // "h" | "e" | "l" | "l" | "o"
type STUTest4 = StringToUnion<"coronavirus">; // "c" | "o" | "r" | "o" | "n" | "a" | "v" | "i" | "r" | "u" | "s"
