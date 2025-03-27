# week13

## Join

Implement the type version of Array.join, Join<T, U> takes an Array T, string or number U and returns the Array T with U stitching up.

```ts
type Res = Join<["a", "p", "p", "l", "e"], "-">; // expected to be 'a-p-p-l-e'
type Res1 = Join<["Hello", "World"], " ">; // expected to be 'Hello World'
type Res2 = Join<["2", "2", "2"], 1>; // expected to be '21212'
type Res3 = Join<["o"], "u">; // expected to be 'o'
```

```ts
type cases = [
  Expect<Equal<Join<['a', 'p', 'p', 'l', 'e'], '-'>, 'a-p-p-l-e'>>,
  Expect<Equal<Join<['Hello', 'World'], ' '>, 'Hello World'>>,
  Expect<Equal<Join<['2', '2', '2'], 1>, '21212'>>,
  Expect<Equal<Join<['o'], 'u'>, 'o'>>,
  Expect<Equal<Join<[], 'u'>, ''>>,
  Expect<Equal<Join<['1', '1', '1']>, '1,1,1'>>,
]

```



### 문제분석

문자열 배열를 입력받아 합쳐준다. 배열 원소 사이사이에는 두번째 제네릭으로 입력된 문자열 혹은 숫자가 들어간다.

숫자는 문자열로 변환되어 입력된다.



### 첫번째 접근 - 정답

```ts
type Join<T extends any[], U extends string | number =','> = 
  T extends [infer First, ...infer Rest]
    ? Rest extends []
      ? First
      : First extends string 
        ? `${First}${U}${Join<Rest, U>}`
        : never
    : ''
```

템플릿 리터럴과 재귀를 활용했다.

Rest가 빈 배열일때 First가 마지막 원소일 때이므로 이때는 U를 더해주지 않았다.