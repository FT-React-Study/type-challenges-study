type MyReadonly2<T extends object, U extends keyof T> = {
  [K in keyof T as K extends U ? never : K]: T[K];
} & {
  readonly [K in keyof T as K extends U ? K : never]: T[K];
};

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

const todo: MyReadonly2<Todo, "title" | "description"> = {
  title: "Hey",
  description: "foobar",
  completed: false,
};

// @ts-expect-error
todo.title = "Hello"; // Error: cannot reassign a readonly property
// @ts-expect-error
todo.description = "barFoo"; // Error: cannot reassign a readonly property
todo.completed = true; // OK
