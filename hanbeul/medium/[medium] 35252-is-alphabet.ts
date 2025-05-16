/*
  35252 - IsAlphabet
  -------
  by Kanon (@ysknsid25) #medium

  ### Question

  Determine if the given letter is an alphabet.

  > View on GitHub: https://tsch.js.org/35252
*/

/* _____________ Your Code Here _____________ */
type Alphabet =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";

type IsAlphabet<S extends string> = S extends Alphabet ? true : false;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<IsAlphabet<"A">, true>>,
  Expect<Equal<IsAlphabet<"z">, true>>,
  Expect<Equal<IsAlphabet<"9">, false>>,
  Expect<Equal<IsAlphabet<"!">, false>>,
  Expect<Equal<IsAlphabet<"😂">, false>>,
  Expect<Equal<IsAlphabet<"">, false>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/35252/answer
  > View solutions: https://tsch.js.org/35252/solutions
  > More Challenges: https://tsch.js.org
*/
