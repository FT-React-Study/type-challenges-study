/*
  9989 - Count Element Number To Object
  -------
  by 凤之兮原 (@kongmingLatern) #보통

  ### 질문

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

  > GitHub에서 보기: https://tsch.js.org/9989/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type SimplePlusOne<N, L extends never[] = []> = N extends number ? L['length'] extends N ? [...L, never]['length'] : SimplePlusOne<N, [...L, never]> : never;

type SimplePlusOneTest = SimplePlusOne<1>;

type Flattern<T extends unknown[]> = T extends [infer F, ...infer R] ? 
  F extends unknown[] ?
    [...Flattern<F>, ...Flattern<R>] :
    [F, ...Flattern<R>] :
  T;

type FlatternTest = Flattern<[1,2,3,[1,2,[3,4,5]]]>;

type AddAttribute<T extends {}, F extends PropertyKey> = {[K in keyof T]: K extends F ? SimplePlusOne<T[K]> : T[K]};

type AddAttributeTest = AddAttribute<{1:1, 2:1, 3:1}, 1>

type CountElement<T extends unknown[], C extends Record<PropertyKey, unknown> = {}> = [T] extends [never] ? {} :
 T extends [infer F extends PropertyKey, ...infer R extends PropertyKey[]] ?
  F extends keyof C ? 
    CountElement<R, {[K in keyof C]: K extends F ? SimplePlusOne<C[K]> : C[K]}>:
    CountElement<R, C & Record<F,1>>:
  // CountElement<R, {[K in keyof C]: K extends F ? SimplePlusOne<C[K]>: C[K]} & Record<F, 1>> :
  C;

type CountElementTest = CountElement<[1,2,3,4,1]>;

type IterateElement<T> = {[K in keyof T]: T[K]}

type CountElementNumberToObject<T extends unknown[]> = IterateElement<CountElement<Flattern<T>>>;

type Test = CountElementNumberToObject<[1,2,3,[1,2,3]]>
  

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<CountElementNumberToObject<[1, 2, 3, 4, 5]>, {
    1: 1
    2: 1
    3: 1
    4: 1
    5: 1
  } >>,
  Expect<Equal<CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3]]>, {
    1: 2
    2: 2
    3: 2
    4: 1
    5: 1
  }>>,
  Expect<Equal<CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3, [4, 4, 1, 2]]]>, {
    1: 3
    2: 3
    3: 2
    4: 3
    5: 1
  }>>,
  Expect<Equal<CountElementNumberToObject<[never]>, {}>>,
  Expect<Equal<CountElementNumberToObject<['1', '2', '0']>, {
    0: 1
    1: 1
    2: 1
  }>>,
  Expect<Equal<CountElementNumberToObject<['a', 'b', ['c', ['d']]]>, {
    'a': 1
    'b': 1
    'c': 1
    'd': 1
  }>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/9989/answer/ko
  > 정답 보기: https://tsch.js.org/9989/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
