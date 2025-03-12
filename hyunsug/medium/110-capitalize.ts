type MyCapitalize<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : S;

type capitalized = MyCapitalize<"hello world">; // expected to be 'Hello world'
