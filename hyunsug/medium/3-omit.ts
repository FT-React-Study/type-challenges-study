type MyOmit<T extends object, U extends keyof T> = {
  [K in Exclude<keyof T, U>]: T[K];
};

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyOmit<Todo, "description" | "title">;

const todo: TodoPreview = {
  completed: false,
};
