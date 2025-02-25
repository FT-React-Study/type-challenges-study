type StartsWith<S extends string, T extends string> = S extends `${T}${string}`
  ? true
  : false;

type a = StartsWith<"abc", "ac">; // expected to be false
type b = StartsWith<"abc", "ab">; // expected to be true
type c = StartsWith<"abc", "abcd">; // expected to be false

type StartsWithTest0 = StartsWith<"abc", "ac">; // expected to be false
type StartsWithTest1 = StartsWith<"abc", "ab">; // expected to be true
type StartsWithTest2 = StartsWith<"abc", "abc">; // expected to be true
type StartsWithTest3 = StartsWith<"abc", "abcd">; // expected to be false
type StartsWithTest4 = StartsWith<"abc", "">; // expected to be true
type StartsWithTest5 = StartsWith<"abc", " ">; // expected to be false
type StartsWithTest6 = StartsWith<"", "">; // expected to be true
