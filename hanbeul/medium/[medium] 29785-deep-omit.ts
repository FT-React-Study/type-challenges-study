/*
  29785 - Deep Omit
  -------
  by bowen (@jiaowoxiaobala) #medium #omit object-keys deep

  ### Question

  Implement a type`DeepOmit`, Like Utility types [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys), A type takes two arguments.

  For example:

  ```ts
  type obj = {
    person: {
      name: string;
      age: {
        value: number
      }
    }
  }

  type test1 = DeepOmit<obj, 'person'>    // {}
  type test2 = DeepOmit<obj, 'person.name'> // { person: { age: { value: number } } }
  type test3 = DeepOmit<obj, 'name'> // { person: { name: string; age: { value: number } } }
  type test4 = DeepOmit<obj, 'person.age.value'> // { person: { name: string; age: {} } }
  ```

  > View on GitHub: https://tsch.js.org/29785
*/

/* _____________ Your Code Here _____________ */

// string에서 .을 기준으로 나눠서 앞 하나씩으로 재귀?
// type DeepOmit<T, S> =
//   S extends `${infer First}.${infer Rest}`
//     ? First extends keyof T
//       ? Record<First, DeepOmit<T[First], Rest>>
//       : never
//     : S extends keyof T
//       ? T[S]
//       : never;

// type example = DeepOmit<obj, 'person'>;

type DeepOmit<T, S> = S extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? {
        [K in keyof T]: K extends First ? DeepOmit<T[K], Rest> : T[K];
      }
    : T
  : S extends keyof T
  ? Omit<T, S>
  : T;

type example1 = DeepOmit<obj, "person">;
type example2 = DeepOmit<obj, "person.name">;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type obj = {
  person: {
    name: string;
    age: {
      value: number;
    };
  };
};

type cases = [
  Expect<Equal<DeepOmit<obj, "person">, {}>>,
  Expect<
    Equal<DeepOmit<obj, "person.name">, { person: { age: { value: number } } }>
  >,
  Expect<Equal<DeepOmit<obj, "name">, obj>>,
  Expect<
    Equal<
      DeepOmit<obj, "person.age.value">,
      { person: { name: string; age: {} } }
    >
  >
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/29785/answer
  > View solutions: https://tsch.js.org/29785/solutions
  > More Challenges: https://tsch.js.org
*/
