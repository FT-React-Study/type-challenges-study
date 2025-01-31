// type TrimLeft<S> = S extends ` ${infer R}` ? TrimLeft<R> : S;
type Space = " " | "\t" | "\n";
type TrimLeft<S extends string> = S extends `${Space}${infer R}`
  ? TrimLeft<R>
  : S;

type TrimLeftTest = TrimLeft<"  Hello World  ">; // expected to be 'Hello World  '

type TrimLeftTest1 = TrimLeft<"str">; // 'str'
type TrimLeftTest2 = TrimLeft<" str">; // 'str'
type TrimLeftTest3 = TrimLeft<"     str">; // 'str'
type TrimLeftTest4 = TrimLeft<"     str     ">; // 'str     '
type TrimLeftTest5 = TrimLeft<"   \n\t foo bar ">; // 'foo bar '
type TrimLeftTest6 = TrimLeft<"">; // ''
type TrimLeftTest7 = TrimLeft<" \n\t">; // ''
