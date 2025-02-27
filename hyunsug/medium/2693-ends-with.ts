type EndsWith<S extends string, T extends string> = S extends `${string}${T}`
  ? true
  : false;

type a = EndsWith<"abc", "bc">; // expected to be true
type b = EndsWith<"abc", "abc">; // expected to be true
type c = EndsWith<"abc", "d">; // expected to be false

type EndsWithTest0 = EndsWith<"abc", "bc">; // expected to be true
type EndsWithTest1 = EndsWith<"abc", "abc">; // expected to be true
type EndsWithTest2 = EndsWith<"abc", "d">; // expected to be false
type EndsWithTest3 = EndsWith<"abc", "ac">; // expected to be false
type EndsWithTest4 = EndsWith<"abc", "">; // expected to be true
type EndsWithTest5 = EndsWith<"abc", " ">; // expected to be false
