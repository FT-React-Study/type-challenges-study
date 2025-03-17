/*
  4179 - Flip
  -------
  by Farhan Kathawala (@kathawala) #medium #object

  ### Question

  Implement the type of `just-flip-object`. Examples:

  ```typescript
  Flip<{ a: "x", b: "y", c: "z" }>; // {x: 'a', y: 'b', z: 'c'}
  Flip<{ a: 1, b: 2, c: 3 }>; // {1: 'a', 2: 'b', 3: 'c'}
  Flip<{ a: false, b: true }>; // {false: 'a', true: 'b'}
  ```

  No need to support nested objects and values which cannot be object keys such as arrays

  > View on GitHub: https://tsch.js.org/4179
*/

/* _____________ Your Code Here _____________ */

// Key를 keyof로 순회한다음에
// T[K]를 키 값으로, K를 value 값으로 넣으면 되지 않을까?
// type Flip<T> = { [K in keyof T as T[K] extends PropertyKey? T[K] : never]: K }

type example1 = Flip<{ 3.14: "pi"; true: "bool" }>;
type example2 = Flip<{ pi: 3.14; bool: true }>;

// boolean 값이 키 값으로 안들어가지는 이슈
type Flip<T> = {
  [K in keyof T as T[K] extends string | number | boolean
    ? `${T[K]}`
    : never]: K;
};

/* _____________ Test Cases _____________ */
import type { Equal, Expect, NotEqual } from "@type-challenges/utils";

type cases = [
  Expect<Equal<{ a: "pi" }, Flip<{ pi: "a" }>>>,
  Expect<NotEqual<{ b: "pi" }, Flip<{ pi: "a" }>>>,
  Expect<Equal<{ 3.14: "pi"; true: "bool" }, Flip<{ pi: 3.14; bool: true }>>>,
  Expect<
    Equal<{ val2: "prop2"; val: "prop" }, Flip<{ prop: "val"; prop2: "val2" }>>
  >
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/4179/answer
  > View solutions: https://tsch.js.org/4179/solutions
  > More Challenges: https://tsch.js.org
*/
