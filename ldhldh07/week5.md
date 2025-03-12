# week 5

## 110 - Capitalize

문자열의 첫 글자만 대문자로 바꾸고 나머지는 그대로 놔두는 `Capitalize<T>`를 구현하세요.

예시:

```
type capitalized = Capitalize<'hello world'> // expected to be 'Hello world'
```

```ts
type MyCapitalize<S extends string> = any

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MyCapitalize<'foobar'>, 'Foobar'>>,
  Expect<Equal<MyCapitalize<'FOOBAR'>, 'FOOBAR'>>,
  Expect<Equal<MyCapitalize<'foo bar'>, 'Foo bar'>>,
  Expect<Equal<MyCapitalize<''>, ''>>,
  Expect<Equal<MyCapitalize<'a'>, 'A'>>,
  Expect<Equal<MyCapitalize<'b'>, 'B'>>,
  Expect<Equal<MyCapitalize<'c'>, 'C'>>,
  Expect<Equal<MyCapitalize<'d'>, 'D'>>,
  Expect<Equal<MyCapitalize<'e'>, 'E'>>,
  Expect<Equal<MyCapitalize<'f'>, 'F'>>,
  Expect<Equal<MyCapitalize<'g'>, 'G'>>,
  Expect<Equal<MyCapitalize<'h'>, 'H'>>,
  Expect<Equal<MyCapitalize<'i'>, 'I'>>,
  Expect<Equal<MyCapitalize<'j'>, 'J'>>,
  Expect<Equal<MyCapitalize<'k'>, 'K'>>,
  Expect<Equal<MyCapitalize<'l'>, 'L'>>,
  Expect<Equal<MyCapitalize<'m'>, 'M'>>,
  Expect<Equal<MyCapitalize<'n'>, 'N'>>,
  Expect<Equal<MyCapitalize<'o'>, 'O'>>,
  Expect<Equal<MyCapitalize<'p'>, 'P'>>,
  Expect<Equal<MyCapitalize<'q'>, 'Q'>>,
  Expect<Equal<MyCapitalize<'r'>, 'R'>>,
  Expect<Equal<MyCapitalize<'s'>, 'S'>>,
  Expect<Equal<MyCapitalize<'t'>, 'T'>>,
  Expect<Equal<MyCapitalize<'u'>, 'U'>>,
  Expect<Equal<MyCapitalize<'v'>, 'V'>>,
  Expect<Equal<MyCapitalize<'w'>, 'W'>>,
  Expect<Equal<MyCapitalize<'x'>, 'X'>>,
  Expect<Equal<MyCapitalize<'y'>, 'Y'>>,
  Expect<Equal<MyCapitalize<'z'>, 'Z'>>,
]
```



### 문제 분석

첫글자만 대문자로 바꿔주는 유틸리티 클래스이다



### 첫번째 접근

첫번째 접근은 유니코드를 통해서 대문자로바꿔주는 방식이다

하지만 타입스크립트에서 유니코드를 문자로 연산해주는것은 지원하지 않는다 하고 Upperclass를 쓰면 된다고 했다.



### 정답

```ts
type MyCapitalize<S extends string> = S extends `${infer first}${infer Rest}` ? `${Uppercase<first>}${Rest}` : ''
```



#### ${infer A}${infer B}

이런식으로 두개로 나눠서 할때 한 문자와, 나머지 문자의 방식으로 분해된다.

타입스크립트가 문자열을 할당할때 두가지 infer 템플릿 리터럴이 연속해 있는 경우 앞에 있는 템플릿 리터럴을 가장 작은 단위로 분해해서 할당한다.



## 116 - Replace

문자열 S에서 `From`를 찾아 한 번만 `To`로 교체하는 `Replace<S, From, To>`를 구현하세요.

예시:

```ts
type replaced = Replace<'types are fun!', 'fun', 'awesome'> // expected to be 'types are awesome!'
```

```ts
/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Replace<'foobar', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<Replace<'foobarbar', 'bar', 'foo'>, 'foofoobar'>>,
  Expect<Equal<Replace<'foobarbar', '', 'foo'>, 'foobarbar'>>,
  Expect<Equal<Replace<'foobarbar', 'bar', ''>, 'foobar'>>,
  Expect<Equal<Replace<'foobarbar', 'bra', 'foo'>, 'foobarbar'>>,
  Expect<Equal<Replace<'', '', ''>, ''>>,
]
```



### 문제분석

제네릭 앞에 있는 문자열에서 두번째 문자열을 세번째 문자열로 바꾸는 유틸리티 함수를 만들어야 한다



### 첫번째 접근

```ts
type Replace<S extends string, From extends string, To extends string> = 
  S extends `${infer before}${From}${infer after}` ? `${before}${To}${after}` : S
```

From앞뒤로 infer로 할당해서 From을 To로 바꾼다

그리고 From이 없을 경우 extends에서 false로 판단해 S를 그대로 반환한다.



이 경우

```ts
  Expect<Equal<Replace<'foobarbar', '', 'foo'>, 'foobarbar'>>,
```

이 케이스가 통과가 안된다

이 경우 빈문자열을 탐색해서 앞뒤를 나눈다 이 경우 테스트케이스에서 요구한 동작은 foobarbar에 공백이 없기때문에 아예 동작하지 않아 기존의 S를 반환하는것이다.

하지만 이 경우 그냥 infer 두개가 연속한것처럼 동작한다. 그래서 앞서 이야기한것처럼 `f`와 `oobarbar`로 나뉘고 `ffoooobarbar`라는 리터럴 타입으로 반환된다



### 두번째 접근 - 정답

정답1

```ts
type Replace<S extends string, From extends string, To extends string> = 
  S extends `${infer before}${From}${infer after}` ? `${before}${From extends '' ? '' : To}${after}` : S
```

From이 공백일때는 To도 공백으로 반환하여 동작상 아무런 변화도 없게 만드는 것이다.

정답2

```ts
type Replace<S extends string, From extends string, To extends string> = 
  S extends `${infer before}${From extends '' ? never : From}${infer after}` ? `${before}${To}${after}` : S
```

이 경우에는 From이 ''인 경우 할당이 안되는 구조를 만들어서 extends의 false를 발생시키는 것이다.

이 구조는 from이 이 문자열에 없을 경우에 extends에서 S를 반환하도록 하는 목적으로 만들어진 로직이며, 이 엣지케이스가 생기는 이유가  ''를 문자열에 없는것으로 판단 못하는 것이 문제이다.

때문에 그걸 명시해서 오류로 지정하는 이 정답이 보다 자연스러워 보인다. 



이때 해당 할당타입에는 내부 string이 할당될 수 없는 어떤 타입이든 들어갈 수 있으며  `never`가 가장 자연스럽다





## 119 - ReplaceAll

주어진 문자열 `S`에서 부분 문자열 `From`을 찾아 모두 `To`로 교체하는 제네릭 `ReplaceAll<S, From, To>`을 구현하세요.

예시:

```ts
type replaced = ReplaceAll<'t y p e s', ' ', ''> // expected to be 'types'
```

```ts
type cases = [
  Expect<Equal<ReplaceAll<'foobar', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<ReplaceAll<'foobar', 'bag', 'foo'>, 'foobar'>>,
  Expect<Equal<ReplaceAll<'foobarbar', 'bar', 'foo'>, 'foofoofoo'>>,
  Expect<Equal<ReplaceAll<'t y p e s', ' ', ''>, 'types'>>,
  Expect<Equal<ReplaceAll<'foobarbar', '', 'foo'>, 'foobarbar'>>,
  Expect<Equal<ReplaceAll<'barfoo', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<ReplaceAll<'foobarfoobar', 'ob', 'b'>, 'fobarfobar'>>,
  Expect<Equal<ReplaceAll<'foboorfoboar', 'bo', 'b'>, 'foborfobar'>>,
  Expect<Equal<ReplaceAll<'', '', ''>, ''>>,
]
```

### 문제 분석

제네릭 두번째 들어가는 단어가 다수 있을 때도 그 다수를 다 변환해야 한다.



### 첫번째 접근

```ts
type ReplaceAll<S extends string, From extends string, To extends string> = 
  S extends `${infer before}${From extends '' ? never : From}${infer after}` 
    ? ReplaceAll<`${before}${To}${after}`, From, To>
    : S
```

재귀로 나온 답을 다시 replace 거는 동작을 설정했다

```ts
  Expect<Equal<ReplaceAll<'foobarfoobar', 'ob', 'b'>, 'fobarfobar'>>,
  Expect<Equal<ReplaceAll<'foboorfoboar', 'bo', 'b'>, 'foborfobar'>>,
```

그럴 경우 이 케이스들이

교체한 단어들이 다시 교체해야할 단어들에 적용이 되어서 원하던 동작이 되지 않았다



### 두번째 접근 - 정답

```ts
type ReplaceAll<S extends string, From extends string, To extends string> = 
  S extends `${infer before}${From extends '' ? never : From}${infer after}` 
    ? `${before}${To}${ReplaceAll<after, From, To>}`
    : S
```

앞에서부터 진행되기 때문에 뒷부분에 재귀를 걸고 뒷부분 재귀를 건 후에 앞부분을 다시 합치는 방식으로 수정했더니 모든 케이스를 통과했다.



## 191 - Append Argument

함수 타입 `Fn`과 어떤 타입 `A`가 주어질 때 `Fn`의 인수와 `A`를 마지막 인수로 받는 `Fn`과 동일한 함수 유형인 `G`를 생성하세요.

예시 :

```ts
type Fn = (a: number, b: string) => number

type Result = AppendArgument<Fn, boolean> 
// 기대되는 결과는 (a: number, b: string, x: boolean) => number 입니다.
```

```ts
type Case1 = AppendArgument<(a: number, b: string) => number, boolean>
type Result1 = (a: number, b: string, x: boolean) => number

type Case2 = AppendArgument<() => void, undefined>
type Result2 = (x: undefined) => void

type cases = [
  Expect<Equal<Case1, Result1>>,
  Expect<Equal<Case2, Result2>>,
  // @ts-expect-error
  AppendArgument<unknown, undefined>,
]
```

### 문제 분석

기존 인수타입에서 두번째 제네릭의 타입을 인수로 추가하는 함수 타입을 생성하는 유틸리티 타입



### 첫번째 접근

```ts
type AppendArgument<Fn extends Function, A> = Fn extends (...args: infer Args) => infer Res ? (x : A, ...args: Args) => Res : never
```

함수 인자타입과 반환타입을 infer로 추론하여 그대로 가져다 썼으며 `x: A`를 추가했다.

`rest 매개 변수는 매개 변수 목록 마지막에 있어야 합니다.ts(1014)`

그렇다고 ...args를 앞에 두면

하지만 x가 인자 마지막에 들어가야 했으며 ...args를 앞으로 옮길수도 없었다



### 두번째 접근

```ts
type AppendArgument<Fn extends Function, A> = Fn extends (...args: infer Args) => infer Res ? (args: [...Args, x : A]) => Res : never
```

타입만 분리해서 했지만 이 경우 args가 배열로 들어갔다



### 세번째 접근 - 정답

```ts
type AppendArgument<Fn extends Function, A> = Fn extends (...args: infer Args) => infer Res ? (...args: [...Args, x : A]) => Res : never
```

스프레드 연산자로 배열 내부 값들이 복사해서 들어가도록 했다





## 296 - Permutation

주어진 유니언 타입을 순열 배열로 바꾸는 Permutation 타입을 구현하세요.

```
type perm = Permutation<'A' | 'B' | 'C'>; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
```

```ts
type cases = [
  Expect<Equal<Permutation<'A'>, ['A']>>,
  Expect<Equal<Permutation<'A' | 'B' | 'C'>, ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']>>,
  Expect<Equal<Permutation<'B' | 'A' | 'C'>, ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']>>,
  Expect<Equal<Permutation<boolean>, [false, true] | [true, false]>>,
  Expect<Equal<Permutation<never>, []>>,
]
```



### 문제 분석

유니언타입의 타입을 순열의 방식을 적용해서 배열들의 유니온으로 반환한다.



### 접근

재귀와 extends를 이용해서 유니온 내의 타입들을 반복하려고 했다.

유니온 타입과 배열을



### 정답

```ts
type Permutation<T, Possible = T> =  
  [T] extends [never] 
    ? [] 
    : T extends Possible
      ? [T, ...Permutation<Exclude<Possible, T>>] 
      : never;
```

T와 T와 같은 A를 제네릭에 넣었다.

T와 조건문을 함께 걸 T와 같은 타입이 하나 있어야 한다고는 생각했지만 제네릭의 default 값을 이용해서 사용하는 방식은 이 정답을 통해 익혔다.



#### [T] extends [never]

재귀를 종료시키면서 동시에 재귀에 마지막 단계에 원하는 동작을 하기 위해서는 , T

가능한 옵션들에 할당하여 분배법칙을 통해 모든 경우의 수를 테스트 하는 방식은 이해했지만 위 문법은 생소했다.



이 조건식의 기능은 재귀를 종료시켜주는 것이다.  Exclude<Possible, T>가 never가 되면 재귀를 종료 해야하며 이때 T가 [never]인지 판단해야 한다.

근데 T가 never인지 판단한때 T는 유니온 타입이기 때문에 분배법칙을 하고 그러면 재귀의 올바른 동작을 하지 못한다.

그렇게 때문에 [T]로 만들어서 분배 법칙이 일어나지 않고 비교할 수 있도록 해주는 식이다.



## 298 - Length of String

`String#length`처럼 동작하는 문자열 리터럴의 길이를 구하세요.

```ts
type cases = [
  Expect<Equal<LengthOfString<''>, 0>>,
  Expect<Equal<LengthOfString<'kumiko'>, 6>>,
  Expect<Equal<LengthOfString<'reina'>, 5>>,
  Expect<Equal<LengthOfString<'Sound! Euphonium'>, 16>>,
]
```



### 문제분석

문자열의 길이를 구하여 반환한다



### 첫번째 접근 - 정답

```ts
type LengthOfString<S extends string, array extends Array<any> = []> = 
  S extends `${infer char}${infer rest}` 
    ? LengthOfString<rest, [char, ...array]> 
    : array['length']
```

문자열을 배열로 바꾼 후에 'length'를 통해서 답을 구했다

문자열을 배열로 바꾸는 것은 extends infer로 한글자씩 재귀 걸고 array라는 제네릭 인자를 통해서 배열로 선언했다.



그리고 재귀가 종료되면 그때 ['length']를 했다