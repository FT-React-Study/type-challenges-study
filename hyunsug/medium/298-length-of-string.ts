// Compute the length of a string literal, which behaves like String#length.

type LengthOfString<
  S extends string,
  L extends string[] = []
> = S extends `${infer F}${infer R}`
  ? LengthOfString<R, [...L, F]>
  : L["length"];

type LengthOfStringTest1 = LengthOfString<"">; // 0
type LengthOfStringTest2 = LengthOfString<"kumiko">; // 6
type LengthOfStringTest3 = LengthOfString<"reina">; // 5
type LengthOfStringTest4 = LengthOfString<"Sound! Euphonium">; // 16
