/*
  9989 - Count Element Number To Object
  -------
  by 凤之兮原 (@kongmingLatern) #medium

  ### Question

  With type ``CountElementNumberToObject``, get the number of occurrences of every item from an array and return them in an object. For example:

  ~~~ts
  type Simple1 = CountElementNumberToObject<[]> // return {}
  type Simple2 = CountElementNumberToObject<[1,2,3,4,5]>
  // return {
  //   1: 1,
  //   2: 1,
  //   3: 1,
  //   4: 1,
  //   5: 1
  // }

  type Simple3 = CountElementNumberToObject<[1,2,3,4,5,[1,2,3]]>
  // return {
  //   1: 2,
  //   2: 2,
  //   3: 2,
  //   4: 1,
  //   5: 1
  // }
  ~~~

  > View on GitHub: https://tsch.js.org/9989
*/

/* _____________ Your Code Here _____________ */

// 일단 flat을 먼저 돌리고..
// 각 요소를 돌면서 result에 존재하는지 확인, 있으면 카운트만 증가, 없으면 새 레코드 추가
type Flatten<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : [];

// type GetResult<T extends Record<string, unknown[]>> = {[K in keyof T]: T[K]['length']}

// type AddResult<T extends PropertyKey, Result extends Record<string, unknown[]>> =
//   {
//     [K in keyof Result]: K extends `${T}` ? [...Result[K], unknown] : Result[K]
//   } & (
//     `${T}` extends keyof Result
//       ? {}
//       : { [K in `${T}`]: [unknown] }
//   )

// type GetCountElement<
//   T extends any[],
//   Result extends Record<string, unknown[]> = {}
// > = T extends [infer First, ...infer Rest]
//   ? [First] extends [never]
//     ? GetCountElement<Rest, Result>
//     : First extends PropertyKey
//       ? GetCountElement<Rest, AddResult<First, Result>>
//       : GetCountElement<Rest, Result>
//   : GetResult<Result>;

// type CountElementNumberToObject<T extends any[]> = GetCountElement<Flatten<T>>

type Count<T, R extends Record<string | number, any[]> = {}> = T extends [
  infer F extends string | number,
  ...infer L
]
  ? F extends keyof R
    ? Count<L, Omit<R, F> & Record<F, [...R[F], 0]>>
    : Count<L, R & Record<F, [0]>>
  : {
      [K in keyof R]: R[K]["length"];
    };

type CountElementNumberToObject<T extends any[]> = [T] extends [[never]]
  ? {}
  : Count<Flatten<T>>;

type Example = CountElementNumberToObject<never>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<
    Equal<
      CountElementNumberToObject<[1, 2, 3, 4, 5]>,
      {
        1: 1;
        2: 1;
        3: 1;
        4: 1;
        5: 1;
      }
    >
  >,
  Expect<
    Equal<
      CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3]]>,
      {
        1: 2;
        2: 2;
        3: 2;
        4: 1;
        5: 1;
      }
    >
  >,
  Expect<
    Equal<
      CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3, [4, 4, 1, 2]]]>,
      {
        1: 3;
        2: 3;
        3: 2;
        4: 3;
        5: 1;
      }
    >
  >,
  Expect<Equal<CountElementNumberToObject<[never]>, {}>>,
  Expect<
    Equal<
      CountElementNumberToObject<["1", "2", "0"]>,
      {
        0: 1;
        1: 1;
        2: 1;
      }
    >
  >,
  Expect<
    Equal<
      CountElementNumberToObject<["a", "b", ["c", ["d"]]]>,
      {
        a: 1;
        b: 1;
        c: 1;
        d: 1;
      }
    >
  >
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/9989/answer
  > View solutions: https://tsch.js.org/9989/solutions
  > More Challenges: https://tsch.js.org
*/
