# Week15

## Appear only once

Find the elements in the target array that appear only once. For example：input: `[1,2,2,3,3,4,5,6,6,6]`，ouput: `[1,4,5]`.

```ts
type cases = [
  Expect<Equal<FindEles<[1, 2, 2, 3, 3, 4, 5, 6, 6, 6]>, [1, 4, 5]>>,
  Expect<Equal<FindEles<[2, 2, 3, 3, 6, 6, 6]>, []>>,
  Expect<Equal<FindEles<[1, 2, 3]>, [1, 2, 3]>>,
  Expect<Equal<FindEles<[1, 2, number]>, [1, 2, number]>>,
  Expect<Equal<FindEles<[1, 2, number, number]>, [1, 2]>>,
]
```



### 문제분석

배열을 제네릭으로 받아서 해당 배열에 하나만 있는 원소들을 배열 형식으로 반환한다.



### 첫번째 접근 - 정답

```ts
type CheckInclude<T extends any[], A> = 
  T extends [infer First, ...infer Rest]
    ? (<T>() => T extends A ? 1 : 2) extends
      (<T>() => T extends First ? 1 : 2)
      ? true
      : Rest extends any[] 
        ? CheckInclude<Rest, A> 
        : never
    : false


type FindEles<T extends any[], PrevT extends any[] = [], Result extends any[] = []> =
  T extends [infer First, ...infer Rest]
    ? Rest extends any[] 
      ? CheckInclude<[...PrevT, ...Rest], First> extends false
        ? FindEles<Rest, [...PrevT, First], [...Result, First]>
        : FindEles<Rest, [...PrevT, First], Result>
      : never
    : Resultts
```

먼저 배열에서 하나씩 원소를 확인하고, 이미 확인한 원소들을 저장한다.

이미 확인한 원소들(앞)과 Rest(뒤)를 합쳐서 배열에서 원소 앞 뒤에 있는 나머지들을 합친 배열을 사용할 수 있도록 한다.



그리고 배열 타입에 특정 타입이 존재하는지 확인하는 유틸리티 타입을 하나 만든다.



그래서 이전에 사용한 배열에서 특정 원소를 제외한 앞뒤 원소들의 배열에 그 원소가 존재하는지 확인한다.

존재하지 않는 경우 Result에 추가한다.



## Count Element Number To Object

With type `CountElementNumberToObject`, get the number of occurrences of every item from an array and return them in an object. For example:

```ts
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
```

```ts
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
```

### 문제 분석

원소들을 몇개 들어있는지 갯수를 세서 value값으로 한 Map을 반환한다



### 첫번째 접근

```ts
type CountElementNumberToObject<
  T extends any[],
  CountMap extends Record<PropertyKey, any[]> = {}
> =
  T extends [infer First, ...infer Rest]
    ? First extends PropertyKey
      ? CountElementNumberToObject<
          Rest,
          {
            [P in keyof CountMap as P extends First ? never : P]: CountMap[P]  
          } & {
            [K in First]: K extends keyof CountMap ? [...CountMap[K], any] : [any]
          }
        >
      : never
    : {[K in keyof CountMap] : CountMap[K]['length']}
```



우선 nested 재귀는 배제하고 카운트를 하고자 했다.

Record를 key값과 배열로 구성한 후 배열에 있는 값이 만약 지금 Record에 키값으로 존재한다면 그 값에 any를 더했다.

그리고 마지막에 &로 연결된 map을 평탄화하면서 length로 값을 바꿔줬다.



### 두번째 접근

그냥 재귀만 해주면 될줄 알았는데

마지막에 map을 정리하는 과정이 들어가서 재귀가 작동하지 않는 현상이 발생했다



```ts
type CountArrayMap<
  T extends any[],
  CountMap extends Record<PropertyKey, any[]> = {}
> =
  T extends [infer First, ...infer Rest]
    ? First extends any[]
      ? CountArrayMap<Rest, CountArrayMap<First, CountMap>>
      : First extends PropertyKey
        ? CountArrayMap<
            Rest,
            {
              [P in keyof CountMap as P extends First ? never : P]: CountMap[P]  
            } & {
              [K in First]: K extends keyof CountMap ? [...CountMap[K], any] : [any]
            }
          >
        : CountArrayMap<Rest, CountMap>
    : CountMap;

type CountElementNumberToObject<T extends any[], MappedT extends Record<PropertyKey, any[]> = CountArrayMap<T>> =    {
  [K in keyof MappedT]: MappedT[K]['length'];
};
```



그래서 마지막 배열의 길이를 체크하는 함수는 분리했다

하지만

```ts
  Expect<Equal<CountElementNumberToObject<[never]>, {}>>,
```

이 케이스가 처리가 안됐다



### 세번째 접근 - 정답

```ts
type CountArrayMap<
  T extends any[],
  CountMap extends Record<PropertyKey, any[]> = {}
> =
  T extends [infer First, ...infer Rest]
    ? First extends never
      ? CountArrayMap<Rest, CountMap>
      : First extends any[]
        ? CountArrayMap<Rest, CountArrayMap<First, CountMap>>
        : First extends PropertyKey
          ? CountArrayMap<
              Rest,
              {
                [P in keyof CountMap as P extends First ? never : P]: CountMap[P];
              } & {
                [K in First]: K extends keyof CountMap ? [...CountMap[K], any] : [any];
              }
            >
          : CountArrayMap<Rest, CountMap>
    : CountMap;

type CountElementNumberToObject<T extends any[], MappedT extends Record<PropertyKey, any[]> = CountArrayMap<T>> = 
  T extends [never] 
    ? {} 
    : {
      [K in keyof MappedT]: MappedT[K]['length'];
    };

```

그냥 통째로 예외처리해버렸다

## Integer

Please complete type `Integer<T>`, type `T` inherits from `number`, if `T` is an integer return it, otherwise return `never`.

```ts
let x = 1
let y = 1 as const

type cases1 = [
  Expect<Equal<Integer<1>, 1>>,
  Expect<Equal<Integer<1.1>, never>>,
  Expect<Equal<Integer<1.0>, 1>>,
  Expect<Equal<Integer<1.000000000>, 1>>,
  Expect<Equal<Integer<0.5>, never>>,
  Expect<Equal<Integer<28.00>, 28>>,
  Expect<Equal<Integer<28.101>, never>>,
  Expect<Equal<Integer<typeof x>, never>>,
  Expect<Equal<Integer<typeof y>, 1>>,
]
```



### 문제 분석

정수인 경우 정수를 반환하고 소수점이 있는 경우나 원시타입 - number 타입인 경우 never를 반환한다.



### 첫번째 접근

```ts
type Integer<T extends number> =
 `${T}` extends `${infer _}.${infer _}`
  ? never
  : T
```

템플릿 리터럴로 문자로 만들었을때 .이 생기면 never를 반환한다.



템플릿 리터럴로 변환하는 과정에서 1.0같은 형태의 숫자 타입도 .이 사라지고 `1`로 바뀌고 T를 반환시키면 유틸리티 타입에서 원하는 동작이 이루어진다



대신 이 코드의 경우 `Integer<typeof x>`의 케이스처럼 number타입이 들어가는 경우 never가 아니라 그냥 number를 반환해버린다

### 두번째 접근 - 정답

```ts
type Integer<T extends number> =
 `${T}` extends `${infer _}.${infer _}`
  ? never
  : number extends T
    ? never
    : T
```

그래서 number를 T에 extends했을때 참이면 never를 아니면 T를 반환하도록 경우 처리를 해줬다.



### To Primitive

Convert a property of type literal (label type) to a primitive type.

```ts
type PersonInfo = {
  name: 'Tom'
  age: 30
  married: false
  addr: {
    home: '123456'
    phone: '13111111111'
  }
  hobbies: ['sing', 'dance']
  readonlyArr: readonly ['test']
  fn: () => any
}

type ExpectedResult = {
  name: string
  age: number
  married: boolean
  addr: {
    home: string
    phone: string
  }
  hobbies: [string, string]
  readonlyArr: readonly [string]
  fn: Function
}

type cases = [
  Expect<Equal<ToPrimitive<PersonInfo>, ExpectedResult>>,
]
```



### 문제 분석

Primitive 값으로 객체 안의 value값들을 전부 바꿔줘야 한다.



### 첫번째 접근 - 정답

```ts
type ArrayToPrimitive<T extends any[]> =
  T extends [infer First, ...infer Rest]
    ? [ToPrimitive<First>, ...ArrayToPrimitive<Rest>]
    : [];

type ToPrimitive<T> =
  T extends string 
    ? string 
    : T extends number 
      ? number 
      : T extends boolean 
        ? boolean 
        : T extends Function 
          ? Function 
          : T extends any[]
            ? ArrayToPrimitive<T>
            : T extends object
              ? { [K in keyof T]: ToPrimitive<T[K]> }
              : T;
```

primitive 타입이 `string, number boolean`이 있다.

그리고 추가적으로 funtion이 있어 그 경우를 각각 처리해줬다.



그리고 배열의 경우 재귀를 처리해야해서 별도의 유틸리티 타입을 만들어서 처리했다.

그리고 nested된 객체도 처리할 수 있고, 이 유틸리티 타입이 기본적으로 객체의 value값을 처리할 수 있도록 객체인 경우 value값에 재귀를 해줬다.

