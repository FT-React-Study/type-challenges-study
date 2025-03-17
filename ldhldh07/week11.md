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
type cases = [
  Expect<Equal<Fibonacci<1>, 1>>,
  Expect<Equal<Fibonacci<2>, 1>>,
  Expect<Equal<Fibonacci<3>, 2>>,
  Expect<Equal<Fibonacci<8>, 21>>,
]
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



## AllCombinations

Implement type `AllCombinations<S>` that return all combinations of strings which use characters from `S` at most once.

For example:

```ts
type AllCombinations_ABC = AllCombinations<'ABC'>;
// should be '' | 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BA' | 'BC' | 'CA' | 'CB' | 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA'
```

```ts
type cases = [
  Expect<Equal<AllCombinations<''>, ''>>,
  Expect<Equal<AllCombinations<'A'>, '' | 'A'>>,
  Expect<Equal<AllCombinations<'AB'>, '' | 'A' | 'B' | 'AB' | 'BA'>>,
  Expect<Equal<AllCombinations<'ABC'>, '' | 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BA' | 'BC' | 'CA' | 'CB' | 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA'>>,
  Expect<Equal<AllCombinations<'ABCD'>, '' | 'A' | 'B' | 'C' | 'D' | 'AB' | 'AC' | 'AD' | 'BA' | 'BC' | 'BD' | 'CA' | 'CB' | 'CD' | 'DA' | 'DB' | 'DC' | 'ABC' | 'ABD' | 'ACB' | 'ACD' | 'ADB' | 'ADC' | 'BAC' | 'BAD' | 'BCA' | 'BCD' | 'BDA' | 'BDC' | 'CAB' | 'CAD' | 'CBA' | 'CBD' | 'CDA' | 'CDB' | 'DAB' | 'DAC' | 'DBA' | 'DBC' | 'DCA' | 'DCB' | 'ABCD' | 'ABDC' | 'ACBD' | 'ACDB' | 'ADBC' | 'ADCB' | 'BACD' | 'BADC' | 'BCAD' | 'BCDA' | 'BDAC' | 'BDCA' | 'CABD' | 'CADB' | 'CBAD' | 'CBDA' | 'CDAB' | 'CDBA' | 'DABC' | 'DACB' | 'DBAC' | 'DBCA' | 'DCAB' | 'DCBA'>>,
]

```



### 첫번째 접근

```ts
type AllCombinations<S extends string, DuplicatedS extends string = S> =
  [S] extends [never]
    ? ''
    : S | '' extends DuplicatedS | ''
      ? `${S}${AllCombinations<Exclude<DuplicatedS, S>>}`
      : never;
```

Permutation을 흉내내어 답을 만들어봤다.



일단 문자열이 유니온이 아니여서 문제가 있었고

공백을 최종 답에 더해줘야 하는 문제가 있었다



### 정답

```ts
type AllCombinations<S extends string, UnionS extends string = StringToUnion<S>> =
  [S] extends [never]
    ? ''
    : { [K in UnionS]: `${K}${AllCombinations<Exclude<UnionS, K>>}`}[UnionS] | '';
```

Map을 이용해서 마킹하고 재귀하는 방식이 정답이었다.

이 방식도 이 방식 자체를 학습해야할 필요가 느껴졌다

이 경우 맵의 계층을 통해 각 값별로 경우를 만들고

최종적으로 모든 원소의 값을 []를 통해 넣어주면서 map에 있는 모든 값을 유니온 값으로 반환한다,.



#### [T] extends [never] 복습

이 조건식의 기능은 재귀를 종료시켜주는 것이다.  Exclude<Possible, T>가 never가 되면 재귀를 종료 해야하며 이때 T가 [never]인지 판단해야 한다.

근데 T가 never인지 판단한때 T는 유니온 타입이기 때문에 분배법칙을 하고 그러면 재귀의 올바른 동작을 하지 못한다.

그렇게 때문에 [T]로 만들어서 분배 법칙이 일어나지 않고 비교할 수 있도록 해주는 식이다.