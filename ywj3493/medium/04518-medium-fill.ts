/*
  4518 - Fill
  -------
  by キリサメ qianxi (@qianxi0410) #보통 #tuple

  ### 질문

  `Fill`, a common JavaScript function, now let us implement it with types.
  `Fill<T, N, Start?, End?>`, as you can see,`Fill` accepts four types of parameters, of which `T` and `N` are required parameters, and `Start` and `End` are optional parameters.
  The requirements for these parameters are: `T` must be a `tuple`, `N` can be any type of value, `Start` and `End` must be integers greater than or equal to 0.

  ```ts
  type exp = Fill<[1, 2, 3], 0> // expected to be [0, 0, 0]
  ```
  In order to simulate the real function, the test may contain some boundary conditions, I hope you can enjoy it :)

  > GitHub에서 보기: https://tsch.js.org/4518/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type SimpleAdder<N extends number, C extends never[] = []> = C['length'] extends N ? [...C, never]['length'] : SimpleAdder<N, [...C, never]>;

type SimpleAdderTest = SimpleAdder<1>;

// type SmallMinusOne<A extends number, Acc extends never[] = []> = Acc['length'] extends A ? 
//   Acc extends [infer _, ...infer Rest] ? 
//     Rest['length'] : 
//     never : 
//   SmallMinusOne<A, [...Acc, never]>;

// type SmallGreaterThan<T extends number, U extends number> = T extends 0 ? 
//   // T == 0 
//   U extends 0 ? 
//     // 둘 다 0
//     false : 
//   // T 는 0, U 는 0이 아닐 때
//   false:
//   // T != 0
//   U extends 0 ?
//     // U 만 0
//     true:
//   // 둘 다 0 이 아닐 때
//   SmallGreaterThan<SmallMinusOne<T>, SmallMinusOne<U>>;

// type ChangeTupleByIndex<T extends unknown[], N, I> = {[K in keyof T]: K extends `${I & number}` ? N : T[K]}

// type ChangeTupleByIndexTest = ChangeTupleByIndex<[1,2,3], 0, 1>

// type Fill<
//   T extends unknown[],
//   N,
//   Start extends number = 0,
//   End extends number = T['length'],
// > = SmallGreaterThan<T['length'], Start> extends true ? T :
//   Start extends End ? 
//     T:
//     Fill<ChangeTupleByIndex<T, N, Start>, N, SimpleAdder<Start>, End>;

type SmallMinusOne<A extends number, Acc extends never[] = []> = Acc['length'] extends A ? 
  Acc extends [infer _, ...infer Rest] ? 
    Rest['length'] : 
    never : 
  SmallMinusOne<A, [...Acc, never]>;

type SmallGreaterThan<T extends number, U extends number> = T extends 0 ? 
  // T == 0 
  U extends 0 ? 
    // 둘 다 0
    false : 
  // T 는 0, U 는 0이 아닐 때
  false:
  // T != 0
  U extends 0 ?
    // U 만 0
    true:
  // 둘 다 0 이 아닐 때
  SmallGreaterThan<SmallMinusOne<T>, SmallMinusOne<U>>;

type Fill<
  T extends unknown[],
  N,
  Start extends number = 0,
  End extends number = T['length'],
  I extends number = 0
> = I extends End ? T:
  T extends [infer First, ...infer Rest] ?
    SmallGreaterThan<Start, I> extends true ? 
      [First, ...Fill<Rest, N, Start, End, SimpleAdder<I>>]:
      [N, ...Fill<Rest, N, Start, End, SimpleAdder<I>>]:
    T;

type Test = Fill<[1, 2, 3], true, 0, 1>;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Fill<[], 0>, []>>,
  Expect<Equal<Fill<[], 0, 0, 3>, []>>,
  Expect<Equal<Fill<[1, 2, 3], 0, 0, 0>, [1, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], 0, 2, 2>, [1, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], 0>, [0, 0, 0]>>,
  Expect<Equal<Fill<[1, 2, 3], true>, [true, true, true]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 0, 1>, [true, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 1, 3>, [1, true, true]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 10, 0>, [1, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 10, 20>, [1, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 0, 10>, [true, true, true]>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/4518/answer/ko
  > 정답 보기: https://tsch.js.org/4518/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
