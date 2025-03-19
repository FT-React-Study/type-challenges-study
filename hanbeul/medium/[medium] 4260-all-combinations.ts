/*
  4260 - AllCombinations
  -------
  by 蛭子屋双六 (@sugoroku-y) #medium #template-literal #infer #union

  ### Question

  Implement type ```AllCombinations<S>``` that return all combinations of strings which use characters from ```S``` at most once.

  For example:

  ```ts
  type AllCombinations_ABC = AllCombinations<'ABC'>;
  // should be '' | 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BA' | 'BC' | 'CA' | 'CB' | 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA'
  ```

  > View on GitHub: https://tsch.js.org/4260
*/

/* _____________ Your Code Here _____________ */

// string-to-union을 실행하고, 그 union을 기반으로 한 permutation을 만들고 다시 합쳐서 string으로 변경한 union을 어쩌구...
// 생각해보니까 이렇게 처리하면 모든 요소를 사용한 놈들만 볼 수 있음.
// type StringToTuple<S extends String> = S extends `${infer First}${infer Last}`
//   ? [First, ...StringToTuple<Last>]
//   : [];

// type StringToUnion<S extends string> = StringToTuple<S>[number];

// type Permutation<T extends string[], K = T> = [T] extends [never]
//   ? []
//   : K extends K
//     ? [K, ...Permutation<Exclude<T, K>>]
//     : never;

// type Join<T extends string[]> = T extends [
//   infer First extends string,
//   ...infer Rest extends string[],
// ]
//   ? `${First}${Join<Rest>}`
//   : "";

// type AllCombinations<S extends string, P = Permutation<StringToUnion<S>>> = P extends P ? Join<P> : never;

// Permutation말고 다른 방식으로 접근해보자.

type StringToUnion<S extends string> = S extends `${infer L}${infer R}`
  ? L | StringToUnion<R>
  : S;

type Combination<A extends string, B extends string> =
  | A
  | B
  | `${A}${B}`
  | `${B}${A}`;

type UnionCombination<A extends string, B extends string = A> = A extends B
  ? Combination<A, UnionCombination<Exclude<B, A>>>
  : never;

type AllCombinations<S extends string> = UnionCombination<StringToUnion<S>>;

type Example = UnionCombination<"A" | "B" | "C">;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<AllCombinations<"">, "">>,
  Expect<Equal<AllCombinations<"A">, "" | "A">>,
  Expect<Equal<AllCombinations<"AB">, "" | "A" | "B" | "AB" | "BA">>,
  Expect<
    Equal<
      AllCombinations<"ABC">,
      | ""
      | "A"
      | "B"
      | "C"
      | "AB"
      | "AC"
      | "BA"
      | "BC"
      | "CA"
      | "CB"
      | "ABC"
      | "ACB"
      | "BAC"
      | "BCA"
      | "CAB"
      | "CBA"
    >
  >,
  Expect<
    Equal<
      AllCombinations<"ABCD">,
      | ""
      | "A"
      | "B"
      | "C"
      | "D"
      | "AB"
      | "AC"
      | "AD"
      | "BA"
      | "BC"
      | "BD"
      | "CA"
      | "CB"
      | "CD"
      | "DA"
      | "DB"
      | "DC"
      | "ABC"
      | "ABD"
      | "ACB"
      | "ACD"
      | "ADB"
      | "ADC"
      | "BAC"
      | "BAD"
      | "BCA"
      | "BCD"
      | "BDA"
      | "BDC"
      | "CAB"
      | "CAD"
      | "CBA"
      | "CBD"
      | "CDA"
      | "CDB"
      | "DAB"
      | "DAC"
      | "DBA"
      | "DBC"
      | "DCA"
      | "DCB"
      | "ABCD"
      | "ABDC"
      | "ACBD"
      | "ACDB"
      | "ADBC"
      | "ADCB"
      | "BACD"
      | "BADC"
      | "BCAD"
      | "BCDA"
      | "BDAC"
      | "BDCA"
      | "CABD"
      | "CADB"
      | "CBAD"
      | "CBDA"
      | "CDAB"
      | "CDBA"
      | "DABC"
      | "DACB"
      | "DBAC"
      | "DBCA"
      | "DCAB"
      | "DCBA"
    >
  >
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/4260/answer
  > View solutions: https://tsch.js.org/4260/solutions
  > More Challenges: https://tsch.js.org
*/
