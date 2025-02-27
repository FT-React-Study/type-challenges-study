type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : symbol extends K
    ? never
    : K]: T[K];
};

type Foo = {
  [key: string]: any;
  foo(): void;
};

type A = RemoveIndexSignature<Foo>; // expected { foo(): void }

type Foo2 = {
  [key: string]: any;
  foo(): void;
};

type Bar = {
  [key: number]: any;
  bar(): void;
  0: string;
};

const foobar = Symbol("foobar");
type FooBar = {
  [key: symbol]: any;
  [foobar](): void;
};

type Baz = {
  bar(): void;
  baz: string;
};

type RemoveIndexSignatureTest1 = RemoveIndexSignature<Foo2>; // { foo(): void }
type RemoveIndexSignatureTest2 = RemoveIndexSignature<Bar>; // { bar(): void, 0: string }
type RemoveIndexSignatureTest3 = RemoveIndexSignature<FooBar>; // { [foobar](): void }
type RemoveIndexSignatureTest4 = RemoveIndexSignature<Baz>; // { bar(): void, baz: string }
