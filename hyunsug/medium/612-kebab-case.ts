// type UppercaseLetter =
//   | "A"
//   | "B"
//   | "C"
//   | "D"
//   | "E"
//   | "F"
//   | "G"
//   | "H"
//   | "I"
//   | "J"
//   | "K"
//   | "L"
//   | "M"
//   | "N"
//   | "O"
//   | "P"
//   | "Q"
//   | "R"
//   | "S"
//   | "T"
//   | "U"
//   | "V"
//   | "W"
//   | "X"
//   | "Y"
//   | "Z";

// type ConcatWithHyphen<T extends string[]> = T extends []
//   ? ""
//   : T extends [infer First extends string, ...infer Rest extends string[]]
//   ? Rest extends []
//     ? `${First}`
//     : `${First}-${ConcatWithHyphen<Rest>}`
//   : never;

// type KebabCase<
//   T extends string,
//   Temp extends string = "",
//   Parts extends string[] = []
// > = T extends `${infer First}${infer Rest}`
//   ? First extends UppercaseLetter
//     ? Temp extends ""
//       ? KebabCase<Rest, Lowercase<First>, Parts>
//       : KebabCase<Rest, Lowercase<First>, [...Parts, `${Temp}`]>
//     : KebabCase<Rest, `${Temp}${First}`, Parts>
//   : ConcatWithHyphen<[...Parts, Temp]>;

type KebabCase<T extends string> = T extends `${infer First}${infer Rest}`
  ? Rest extends Uncapitalize<Rest>
    ? `${Uncapitalize<First>}${KebabCase<Rest>}`
    : `${Uncapitalize<First>}-${KebabCase<Rest>}`
  : T;

type FooBarBaz = KebabCase<"FooBarBaz">;
const foobarbaz: FooBarBaz = "foo-bar-baz";

type DoNothing = KebabCase<"do-nothing">;
const doNothing: DoNothing = "do-nothing";

type KebabTest1 = KebabCase<"FooBarBaz">; // 'foo-bar-baz'
type KebabTest2 = KebabCase<"fooBarBaz">; // 'foo-bar-baz'
type KebabTest3 = KebabCase<"foo-bar">; // 'foo-bar'
type KebabTest4 = KebabCase<"foo_bar">; // 'foo_bar'
type KebabTest5 = KebabCase<"Foo-Bar">; // 'foo--bar'
type KebabTest6 = KebabCase<"ABC">; // 'a-b-c'
type KebabTest7 = KebabCase<"-">; // '-'
type KebabTest8 = KebabCase<"">; // ''
type KebabTest9 = KebabCase<"😎">; // '😎'
