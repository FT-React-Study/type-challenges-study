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