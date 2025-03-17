# Week11

## Flip

Implement the type of `just-flip-object`. Examples:

```
Flip<{ a: "x", b: "y", c: "z" }>; // {x: 'a', y: 'b', z: 'c'}
Flip<{ a: 1, b: 2, c: 3 }>; // {1: 'a', 2: 'b', 3: 'c'}
Flip<{ a: false, b: true }>; // {false: 'a', true: 'b'}
```



No need to support nested objects and values which cannot be object keys such as arrays

```ts
type cases = [
  Expect<Equal<{ a: 'pi' }, Flip<{ pi: 'a' }>>>,
  Expect<NotEqual<{ b: 'pi' }, Flip<{ pi: 'a' }>>>,
  Expect<Equal<{ 3.14: 'pi', true: 'bool' }, Flip<{ pi: 3.14, bool: true }>>>,
  Expect<Equal<{ val2: 'prop2', val: 'prop' }, Flip<{ prop: 'val', prop2: 'val2' }>>>,
]
```



### 문제분석

객체 속성에서 key와 value값을 뒤집어준다



### 첫번째 접근

```ts
type Flip<T> = {
  [P in keyof T as T[P] extends PropertyKey ? T[P] : never] : P
}
```

key는 as를 통해 value의 값으로 만들어주고 value에는 P를 그대로 넣었다



이 경우 세번째 케이스에서 오류가 났다.

boolean은 PropertyKey로 원래 될 수 없는 값인데 이 케이스에는 일종의 string으로 자동변환되어서 적용되는 느낌으로 키값으로 들어간다.



### 두번째 접근 - 정답

```ts
type Flip<T> = {
  [P in keyof T as 
    T[P] extends boolean | null | undefined 
      ? `${T[P]}`
      : T[P] extends PropertyKey
        ? T[P]
        : never
  ]: P
}
```

string으로 바꿀 수 있는 boolean | null | undefined의 경우 템플릿 리터럴로 string으로 바꿔서 넣었다



## FIbonacci Sequence

Implement a generic `Fibonacci<T>` that takes a number `T` and returns its corresponding [Fibonacci number](https://en.wikipedia.org/wiki/Fibonacci_number).

The sequence starts: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...

For example

```ts
type Result1 = Fibonacci<3> // 2
type Result2 = Fibonacci<8> // 21
```

```ts
/*
  4182 - Fibonacci Sequence
  -------
  by windliang (@wind-liang) #보통

  ### 질문

  Implement a generic `Fibonacci<T>` that takes a number `T` and returns its corresponding [Fibonacci number](https://en.wikipedia.org/wiki/Fibonacci_number).

  The sequence starts:
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...

  For example
  ```ts
  type Result1 = Fibonacci<3> // 2
  type Result2 = Fibonacci<8> // 21
  ```

  > GitHub에서 보기: https://tsch.js.org/4182/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type Fibonacci<T extends number> = any

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Fibonacci<1>, 1>>,
  Expect<Equal<Fibonacci<2>, 1>>,
  Expect<Equal<Fibonacci<3>, 2>>,
  Expect<Equal<Fibonacci<8>, 21>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/4182/answer/ko
  > 정답 보기: https://tsch.js.org/4182/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
```


### 문제분석

피보나치 수열이다

이전 답을 계속해서 메모이제이션 하면서 더하는 방식을 구현하면 되겠다 싶었다

문제는 그 방법인데, 그 값 대신 그 값만큼의 원소가 들어있는 배열 타입을 메모이제이션 하면서 진행하면 되지 않을까 싶었다.



### 정답

```ts
type Fibonacci<
  T extends number,
  CountArray extends Array<any> = ['박대연'],
  CurrentAccArray extends  Array<any> = ['박대연'],
  PrevAccArray extends Array<any> = [],
> =
  T extends CountArray['length']
    ? CurrentAccArray['length']
    : Fibonacci<T, [...CountArray, '박대연'], [...PrevAccArray, ...CurrentAccArray], CurrentAccArray>;
```

현재 더하고 있는 수를 저장하고

이전 답을 갯수로 가지고 있는 배열을 메모이제이션 해서 재귀로 유지했다.



그리고 Count가 T가 될때까지 더하고 저장하고를 반복했다.