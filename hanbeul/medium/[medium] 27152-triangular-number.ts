/*
  27152 - Triangular number
  -------
  by null (@aswinsvijay) #medium #tuple #array #math

  ### Question

  Given a number N, find the Nth triangular number, i.e. `1 + 2 + 3 + ... + N`

  > View on GitHub: https://tsch.js.org/27152
*/

/* _____________ Your Code Here _____________ */

// N 하나씩 줄여가며 array 길이 늘려서 처리하기... 안터지려나
type NArr<
  N extends number,
  Result extends unknown[] = []
> = Result["length"] extends N ? Result : NArr<N, [...Result, unknown]>;

type Triangular<
  N extends number,
  FirstArr extends unknown[] = NArr<N>,
  Result extends unknown[] = []
> = FirstArr["length"] extends 0
  ? Result["length"]
  : FirstArr extends [infer _, ...infer Rest]
  ? Triangular<N, Rest, [...Result, ...FirstArr]>
  : never;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<Triangular<0>, 0>>,
  Expect<Equal<Triangular<1>, 1>>,
  Expect<Equal<Triangular<3>, 6>>,
  Expect<Equal<Triangular<10>, 55>>,
  Expect<Equal<Triangular<20>, 210>>,
  Expect<Equal<Triangular<55>, 1540>>,
  Expect<Equal<Triangular<100>, 5050>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/27152/answer
  > View solutions: https://tsch.js.org/27152/solutions
  > More Challenges: https://tsch.js.org
*/
