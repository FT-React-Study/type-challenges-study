type Space = " " | "\t" | "\n";

type Trim<S extends string> = S extends `${Space}${infer R}`
  ? Trim<R>
  : S extends `${infer R}${Space}`
  ? Trim<R>
  : S;

type TrimTest = Trim<"  Hello World  ">; // expected to be 'Hello World'

type TrimTest1 = Trim<"str">; // 'str'
type TrimTest2 = Trim<" str">; // 'str'
type TrimTest3 = Trim<"     str">; // 'str'
type TrimTest4 = Trim<"str   ">; // 'str'
type TrimTest5 = Trim<"     str     ">; // 'str'
type TrimTest6 = Trim<"   \n\t foo bar \t">; // 'foo bar'
type TrimTest7 = Trim<"">; // ''
type TrimTest8 = Trim<" \n\t ">; // ''
