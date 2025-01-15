// 처음 풀이
// type Includes<T extends any[], U> = U extends T[number] ? true : false;

import { Equal } from "../common/Equal";

// 두번째 풀이
type Includes<T extends any[], U> = T extends [infer F, ...infer R]
  ? Equal<F, U> extends true
    ? true
    : Includes<R, U>
  : false;

// 객체를 생성하고 나열한 뒤 다시 배열로 만드는 방법

// Original
type isPillarMen = Includes<["Kars", "Esidisi", "Wamuu", "Santana"], "Dio">;

type cases = [
  Includes<["Kars", "Esidisi", "Wamuu", "Santana"], "Kars">, // expected to be true
  Includes<["Kars", "Esidisi", "Wamuu", "Santana"], "Dio">, // expected to be false
  Includes<[1, 2, 3, 5, 6, 7], 7>, // expected to be true
  Includes<[1, 2, 3, 5, 6, 7], 4>, // expected to be false
  Includes<[1, 2, 3], 2>, // expected to be true
  Includes<[1, 2, 3], 2>, // expected to be true
  Includes<[1, 2, 3], 1>, // expected to be true
  Includes<[{}], { a: "A" }>, // expected to be false
  Includes<[boolean, 2, 3, 5, 6, 7], false>, // expected to be false
  Includes<[true, 2, 3, 5, 6, 7], boolean>, // expected to be false
  Includes<[false, 2, 3, 5, 6, 7], false>, // expected to be true
  Includes<[{ a: "A" }], { readonly a: "A" }>, // expected to be false
  Includes<[{ readonly a: "A" }], { a: "A" }>, // expected to be false
  Includes<[1], 1 | 2>, // expected to be false
  Includes<[1 | 2], 1>, // expected to be false
  Includes<[null], undefined>, // expected to be false
  Includes<[undefined], null> // expected to be false
];
