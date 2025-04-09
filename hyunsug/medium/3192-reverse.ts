type Reverse<T extends readonly any[]> = T extends [infer First, ...infer Rest]
  ? [...Reverse<Rest>, First]
  : T;

type a = Reverse<["a", "b"]>; // ['b', 'a']
type b = Reverse<["a", "b", "c"]>; // ['c', 'b', 'a']

// @ts-expect-error
type objectErr = Reverse<{ a: 1 }>;
