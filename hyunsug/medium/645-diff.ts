type Diff<O, O1> = Omit<O & O1, keyof (O | O1)>;

// Get an Object that is the difference between O & O1
type Foo = {
  name: string;
  age: string;
};
type Bar = {
  name: string;
  age: string;
  gender: number;
};
type Coo = {
  name: string;
  gender: number;
};

type DiffTest1 = Diff<Foo, Bar>; // { gender: number }
type DiffTest2 = Diff<Bar, Foo>; // { gender: number }
type DiffTest3 = Diff<Foo, Coo>; // { age: string; gender: number }
type DiffTest4 = Diff<Coo, Foo>; // { age: string; gender: number }
