type TupleToNestedObject<T extends string[], U> = T extends [
  infer First extends string,
  ...infer Rest extends string[]
]
  ? { [K in First]: TupleToNestedObject<Rest, U> }
  : U;

type a = TupleToNestedObject<["a"], string>; // {a: string}
type b = TupleToNestedObject<["a", "b"], number>; // {a: {b: number}}
type c = TupleToNestedObject<[], boolean>; // boolean. if the tuple is empty, just return the U type
