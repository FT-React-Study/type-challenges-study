type Pop<T extends readonly any[]> = T extends [...infer F, infer _] ? F : [];

type arr1 = ["a", "b", "c", "d"];
type arr2 = [3, 2, 1];

type re1 = Pop<arr1>; // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2>; // expected to be [3, 2]

type cases = [
  Pop<[3, 2, 1]>, // [3, 2]
  Pop<["a", "b", "c", "d"]>, // ['a', 'b', 'c']
  Pop<[]> // []
];
