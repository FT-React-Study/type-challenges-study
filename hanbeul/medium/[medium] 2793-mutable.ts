/*
  2793 - Mutable
  -------
  by jiangshan (@jiangshanmeta) #medium #readonly #object-keys

  ### Question

  Implement the generic ```Mutable<T>``` which makes all properties in ```T``` mutable (not readonly).

  For example

  ```typescript
  interface Todo {
    readonly title: string
    readonly description: string
    readonly completed: boolean
  }

  type MutableTodo = Mutable<Todo> // { title: string; description: string; completed: boolean; }

  ```

  > View on GitHub: https://tsch.js.org/2793
*/

/* _____________ Your Code Here _____________ */

// 뭔가 키 순회+리맵핑 과정에서 조건부 처리로 해볼 수 있지 않을까? 안되겠는데
// 그렇다면, 아예 키값들을 따로 떼오고, 그걸 돌려보자
// -readonly라는게 있네

// type Mutable<T, K extends keyof T = keyof T> = {
//   -readonly [P in keyof T as P extends K ? P : never]: T[P];
// }

// 이렇게 했더니 리스트가 통과가 안됨
// 리스트 먼저 처리
// type Mutable<T> = T extends readonly [...infer R]
//   ? [...R]
//   : { -readonly [P in keyof T]: T[P] };

// 이번엔 에러 처리를 못하네
// 최초로 object가 아닌 값은 제외처리해야할 듯
type Mutable<T extends object> = T extends readonly [...infer R]
  ? [...R]
  : { -readonly [P in keyof T]: T[P] };

// type example = Mutable<0>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

interface Todo1 {
  title: string;
  description: string;
  completed: boolean;
  meta: {
    author: string;
  };
}

type List = [1, 2, 3];

type cases = [
  Expect<Equal<Mutable<Readonly<Todo1>>, Todo1>>,
  Expect<Equal<Mutable<Readonly<List>>, List>>,
];

type errors = [
  // @ts-expect-error
  Mutable<"string">,
  // @ts-expect-error
  Mutable<0>,
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/2793/answer
  > View solutions: https://tsch.js.org/2793/solutions
  > More Challenges: https://tsch.js.org
*/
