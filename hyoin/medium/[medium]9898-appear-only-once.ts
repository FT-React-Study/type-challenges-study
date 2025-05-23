/*
  9898 - Appear only once
  -------
  by X.Q. Chen (@brenner8023) #medium

  ### Question

  Find the elements in the target array that appear only once. For example：input: `[1,2,2,3,3,4,5,6,6,6]`，ouput: `[1,4,5]`.

  > View on GitHub: https://tsch.js.org/9898
*/

/* _____________ Your Code Here _____________ */

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;

type Include<T extends any[], U> = T extends [infer First, ...infer Rest]
  ? Equal<First,U> extends true
    ? true
    : Include<Rest,U>
  : false

type MyPop<T extends any[], U, Result extends any[]= []> = T extends [infer First, ...infer Rest]
  ? Equal<First,U> extends true
    ? MyPop<Rest,U,Result>
    : MyPop<Rest,U,[...Result,First]>
  : Result

type FindEles<
  T extends any[], 
> = T extends [...infer Rest, infer Last]
  ? Include<Rest,Last> extends true
    ? FindEles<MyPop<T,Last>>
    : [...FindEles<Rest>,Last]
  : []

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<FindEles<[1, 2, 2, 3, 3, 4, 5, 6, 6, 6]>, [1, 4, 5]>>,
  Expect<Equal<FindEles<[2, 2, 3, 3, 6, 6, 6]>, []>>,
  Expect<Equal<FindEles<[1, 2, 3]>, [1, 2, 3]>>,
  Expect<Equal<FindEles<[1, 2, number]>, [1, 2, number]>>,
  Expect<Equal<FindEles<[1, 2, number, number]>, [1, 2]>>,
]

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/9898/answer
  > View solutions: https://tsch.js.org/9898/solutions
  > More Challenges: https://tsch.js.org
*/
