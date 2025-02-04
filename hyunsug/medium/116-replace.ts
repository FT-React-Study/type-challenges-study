type Replace<
  S extends string,
  From extends string,
  To extends string
> = From extends ""
  ? S
  : S extends `${infer Pre}${From}${infer Rest}`
  ? `${Pre}${To}${Rest}`
  : S;

type replaced = Replace<"types are fun!", "fun", "awesome">; // expected to be 'types are awesome!'

type Test1 = Replace<"foobar", "bar", "foo">; // 'foofoo'
type Test2 = Replace<"foobarbar", "bar", "foo">; // 'foofoobar'
type Test3 = Replace<"foobarbar", "", "foo">; // 'foobarbar'
type Test4 = Replace<"foobarbar", "bar", "">; // 'foobar'
type Test5 = Replace<"foobarbar", "bra", "foo">; // 'foobarbar'
type Test6 = Replace<"", "", "">; // ''
