/*
  2946 - ObjectEntries
  -------
  by jiangshan (@jiangshanmeta) #medium #object

  ### Question

  Implement the type version of ```Object.entries```

  For example

  ```typescript
  interface Model {
    name: string;
    age: number;
    locations: string[] | null;
  }
  type modelEntries = ObjectEntries<Model> // ['name', string] | ['age', number] | ['locations', string[] | null];
  ```

  > View on GitHub: https://tsch.js.org/2946
*/

/* _____________ Your Code Here _____________ */

// 키 값을 순회하고, 그놈의 value랑 묶은 tuple를 합친 tuple을 만들어 union으로 변경
// type ObjectEntries<T> = {
//   [K in keyof T]: [K, T[K] extends undefined ? undefined : T[K]];
// }[keyof T];

type partialExample = Partial<Model>;

// 이 경우 optional한 값들에 대해 처리할 수 없음
// optional한 값들을 처리할 방법을 알아보자
// type ObjectEntries<T> = {
//   [K in keyof T]-?: [K, T[K] extends undefined ? undefined : T[K]];
// }[keyof T];

// partial에 대해서는 처리가 안되네?
// something | undefined에 대한 처리 필요
type example = ObjectEntries<Partial<Model>>;

// type ObjectEntries<T> = {
//   [K in keyof T]-?: [K, T[K] extends undefined ? undefined : Exclude<T[K], undefined>];
// }[keyof T];

// 그냥 냅다 해버리면 안되고, K가 optional 일때만 처리해야되는데...
// 키 값을 옵셔널하게 한 번 더 처리하자
type IsOptional<T, K extends keyof T> = {} extends Pick<T, K> ? true : false;

type ObjectEntries<T> = {
  [K in keyof T]-?: IsOptional<T, K> extends true
    ? [K, T[K] extends undefined ? undefined : Exclude<T[K], undefined>]
    : [K, T[K] extends undefined ? undefined : T[K]];
}[keyof T];

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}

type ModelEntries =
  | ["name", string]
  | ["age", number]
  | ["locations", string[] | null];

type cases = [
  Expect<Equal<ObjectEntries<Model>, ModelEntries>>,
  Expect<Equal<ObjectEntries<Partial<Model>>, ModelEntries>>,
  Expect<Equal<ObjectEntries<{ key?: undefined }>, ["key", undefined]>>,
  Expect<Equal<ObjectEntries<{ key: undefined }>, ["key", undefined]>>,
  Expect<
    Equal<
      ObjectEntries<{ key: string | undefined }>,
      ["key", string | undefined]
    >
  >,
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/2946/answer
  > View solutions: https://tsch.js.org/2946/solutions
  > More Challenges: https://tsch.js.org
*/
