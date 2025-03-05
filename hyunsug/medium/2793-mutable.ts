type Mutable<T extends object> = {
  -readonly [K in keyof T]: T[K];
};

interface Todo {
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
}

type MutableTodo = Mutable<Todo>; // { title: string; description: string; completed: boolean; }

interface Todo1 {
  title: string;
  description: string;
  completed: boolean;
  meta: {
    author: string;
  };
}

type List = [1, 2, 3];

type MutableTest = Mutable<Readonly<Todo1>>; // Todo1
type MutableTest2 = Mutable<Readonly<List>>; // List

// @ts-expect-error
type MutableErrorTest = Mutable<"string">;
// @ts-expect-error
type MutableErrorTest2 = Mutable<0>;
