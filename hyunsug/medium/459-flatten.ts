type Flatten<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : T;

type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]>; // [1, 2, 3, 4, 5]

type TestCase1 = Flatten<[]>; // []
type TestCase2 = Flatten<[1, 2, 3, 4]>; // [1, 2, 3, 4]
type TestCase3 = Flatten<[1, [2]]>; // [1, 2]
type TestCase4 = Flatten<[1, 2, [3, 4], [[[5]]]]>; // [1, 2, 3, 4, 5]
type TestCase5 = Flatten<[{ foo: "bar"; 2: 10 }, "foobar"]>; // [{ foo: 'bar'; 2: 10 }, 'foobar']
