/*
  16259 - ToPrimitive
  -------
  by 前端子鱼 (@mwc) #medium

  ### Question

  Convert a property of type literal (label type) to a primitive type.

  For example

  ```typescript
  type X = {
    name: 'Tom',
    age: 30,
    married: false,
    addr: {
      home: '123456',
      phone: '13111111111'
    }
  }

  type Expected = {
    name: string,
    age: number,
    married: boolean,
    addr: {
      home: string,
      phone: string
    }
  }
  type Todo = ToPrimitive<X> // should be same as `Expected`
  ```

  > View on GitHub: https://tsch.js.org/16259
*/

/* _____________ Your Code Here _____________ */

// // 각 객체 돌면서 infer 해주면 되는거 아닐까?
// type InferType<T> =
//   T extends string ? string :
//   T extends number ? number :
//   T extends boolean ? boolean :
//   T extends (...args: any[]) => any ? Function :
//   T extends any[] ? ChangeArray<T> :
//   T extends object ? { [K in keyof T]: InferType<T[K]> } :
//   T;

// type ChangeArray<T extends any[]> = {
//   [K in keyof T]: InferType<T[K]>
// }

// type ChangeObject<T> =
//   T extends (...args: any[]) => any ? Function :
//   T extends any[] ? ChangeArray<T> :
//   T extends object ? { [K in keyof T]: InferType<T[K]> } :
//   T;

// type ChangeValue<T> =
//   T extends string ? string :
//   T extends number ? number :
//   T extends boolean ? boolean :
//   T;

// type ToPrimitive<T extends object> =
//   T extends [...infer R]
//     ? InferType<R>
//     : {
//         [K in keyof T]:
//           T[K] extends object
//             ? ChangeObject<T[K]>
//             : InferType<T[K]>
//       }

type PrimitiveType<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends (...args: any[]) => any
  ? Function
  : T extends any[] | object
  ? { [K in keyof T]: PrimitiveType<T[K]> }
  : T;

type ToPrimitive<T extends object> = { [K in keyof T]: PrimitiveType<T[K]> };

type example = ToPrimitive<PersonInfo>;

// 너무 지저분해서 리팩토링

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type PersonInfo = {
  name: "Tom";
  age: 30;
  married: false;
  addr: {
    home: "123456";
    phone: "13111111111";
  };
  hobbies: ["sing", "dance"];
  readonlyArr: readonly ["test"];
  fn: () => any;
};

type ExpectedResult = {
  name: string;
  age: number;
  married: boolean;
  addr: {
    home: string;
    phone: string;
  };
  hobbies: [string, string];
  readonlyArr: readonly [string];
  fn: Function;
};

type cases = [Expect<Equal<ToPrimitive<PersonInfo>, ExpectedResult>>];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/16259/answer
  > View solutions: https://tsch.js.org/16259/solutions
  > More Challenges: https://tsch.js.org
*/
