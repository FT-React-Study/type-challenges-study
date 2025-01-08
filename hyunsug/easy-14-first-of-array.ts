// type First<T extends any[]> = T extends [] ? never : T[0];
type First<T extends any[]> = T extends [infer A, ...infer rest] ? A : never;

// Original Question
type arr1 = ["a", "b", "c"];
type arr2 = [3, 2, 1];
type arr3 = [];

type head1 = First<arr1>; // expected to be 'a'
type head2 = First<arr2>; // expected to be 3
type head3 = First<arr3>;
