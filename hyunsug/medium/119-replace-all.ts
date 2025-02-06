type ReplaceAll<
  S extends string,
  From extends string,
  To extends string
> = From extends ""
  ? S
  : S extends `${infer Pre}${From}${infer Rest}`
  ? `${Pre}${To}${ReplaceAll<Rest, From, To>}`
  : S;

type allReplaced = ReplaceAll<"t y p e s", " ", "">; // expected to be 'types'

type RATest1 = ReplaceAll<"foobar", "bar", "foo">; // 'foofoo'
type RATest2 = ReplaceAll<"foobar", "bag", "foo">; // 'foobar'
type RATest3 = ReplaceAll<"foobarbar", "bar", "foo">; // 'foofoofoo'
type RATest4 = ReplaceAll<"t y p e s", " ", "">; // 'types'
type RATest5 = ReplaceAll<"foobarbar", "", "foo">; // 'foobarbar'
type RATest6 = ReplaceAll<"barfoo", "bar", "foo">; // 'foofoo'
type RATest7 = ReplaceAll<"foobarfoobar", "ob", "b">; // 'fobarfobar'
type RATest8 = ReplaceAll<"foboorfoboar", "bo", "b">; // 'foborfobar'
type RATest9 = ReplaceAll<"", "", "">; // ''
