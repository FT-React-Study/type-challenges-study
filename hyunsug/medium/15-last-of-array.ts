type Last<T extends readonly any[]> = T extends [...infer _, infer L]
  ? L
  : never;

type arr1 = ["a", "b", "c"];
type arr2 = [3, 2, 1];

type tail1 = Last<arr1>; // expected to be 'c'
type tail2 = Last<arr2>; // expected to be 1

type cases = [
  Last<[]>, // never,
  Last<[2]>, // 2,
  Last<[3, 2, 1]>, //  1,
  Last<[() => 123, { a: string }]> // { a: string }
];
