type TupleToUnion<T> = T extends ReadonlyArray<infer U> ? U : never;

type Arr = ["1", "2", "3"];

const testArr = [123, "456", false] as const;

type Test = TupleToUnion<Arr>; // expected to be '1' | '2' | '3'

type T1 = TupleToUnion<[123, "456", true]>; // expected to be 123 | '456' | true
type T2 = TupleToUnion<[123]>; // expected to be 123
type T3 = TupleToUnion<typeof testArr>;
