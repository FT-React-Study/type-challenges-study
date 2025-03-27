/*
  4518 - Fill
  -------
  by キリサメ qianxi (@qianxi0410) #medium #tuple

  ### Question

  `Fill`, a common JavaScript function, now let us implement it with types.
  `Fill<T, N, Start?, End?>`, as you can see,`Fill` accepts four types of parameters, of which `T` and `N` are required parameters, and `Start` and `End` are optional parameters.
  The requirements for these parameters are: `T` must be a `tuple`, `N` can be any type of value, `Start` and `End` must be integers greater than or equal to 0.

  ```ts
  type exp = Fill<[1, 2, 3], 0> // expected to be [0, 0, 0]
  ```
  In order to simulate the real function, the test may contain some boundary conditions, I hope you can enjoy it :)

  > View on GitHub: https://tsch.js.org/4518
*/

/* _____________ Your Code Here _____________ */

// T를 infer로 분해한 뒤,한 칸씩 전진
// 이 때 인덱스를 기록하기 위한 배열(length)을 만들어서 하나씩 채워감
// 배열의 길이가 Start와 같을 때, 특정 스위치 값 on
// 배열의 길이가 End와 같아질 때, 특정 스위치 값 off
// End 도달하기 전에 끝나면 그냥 Return 갈기기

type Fill<
  T extends unknown[],
  N,
  Start extends number = 0,
  End extends number = T["length"],
  Index extends unknown[] = [],
  Switch extends boolean = false,
  Result extends any[] = []
> = T extends [infer First, ...infer Rest]
  ? Switch extends true
    ? Index["length"] extends End
      ? [...Result, ...T]
      : Fill<Rest, N, Start, End, [...Index, unknown], Switch, [...Result, N]>
    : Index["length"] extends Start
    ? Start extends End
      ? [...Result, First, ...Rest]
      : Fill<Rest, N, Start, End, [...Index, unknown], true, [...Result, N]>
    : Fill<Rest, N, Start, End, [...Index, unknown], Switch, [...Result, First]>
  : Result;

type Example = Fill<[1, 2, 3], 0>;
type Example1 = Fill<[1, 2, 3], true>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

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
  Expect<Equal<Fill<[1, 2, 3], true, 0, 10>, [true, true, true]>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/4518/answer
  > View solutions: https://tsch.js.org/4518/solutions
  > More Challenges: https://tsch.js.org
*/
