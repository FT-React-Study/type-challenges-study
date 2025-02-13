type Merge<T, U> = {
  [key in keyof T | keyof U]: key extends keyof U
    ? U[key]
    : key extends keyof T
    ? T[key]
    : never;
};

type foo = {
  name: string;
  age: string;
};

type coo = {
  age: number;
  sex: string;
};

type Result = Merge<foo, coo>; // expected to be {name: string, age: number, sex: string}
