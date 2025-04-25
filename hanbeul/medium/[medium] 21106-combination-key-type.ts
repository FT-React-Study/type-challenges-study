/*
  21106 - Combination key type
  -------
  by Nauxscript (@Nauxscript) #medium

  ### Question

  1. Combine multiple modifier keys, but the same modifier key combination cannot appear.
  2. In the `ModifierKeys` provided, the priority of the previous value is higher than the latter value; that is, `cmd ctrl` is OK, but `ctrl cmd` is not allowed.

  > View on GitHub: https://tsch.js.org/21106
*/

/* _____________ Your Code Here _____________ */

// 기존 콤비네이션 코드 차용
// type MakeCombination<A extends string, B extends string> =
//   B extends '' ? A : `${A} ${B}`;

// type UnionCombination<A extends string, B extends string = A> =
//   [A] extends [never]
//     ? ''
//     : A extends B
//       ? MakeCombination<A, UnionCombination<Exclude<B, A>>>
//       : never;

// type Combs<T extends any[]> = UnionCombination<T[number]>;

// 답지 확인..
type Combs<T extends string[] = ModifierKeys> = T extends [
  infer F extends string,
  ...infer R extends string[]
]
  ? `${F} ${R[number]}` | Combs<R>
  : never;

type example = Combs<ModifierKeys>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type ModifierKeys = ["cmd", "ctrl", "opt", "fn"];
type CaseTypeOne =
  | "cmd ctrl"
  | "cmd opt"
  | "cmd fn"
  | "ctrl opt"
  | "ctrl fn"
  | "opt fn";

type cases = [Expect<Equal<Combs<ModifierKeys>, CaseTypeOne>>];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/21106/answer
  > View solutions: https://tsch.js.org/21106/solutions
  > More Challenges: https://tsch.js.org
*/
