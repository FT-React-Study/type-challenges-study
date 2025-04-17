# week16

## FIlter

원시 타입 또는 유니온 원시 타입인 `Predicate`과 `Predicate`의 요소로 포함되는 배열을 반환하고, 배열 `T`를 가지는 `Filter<T, Predicate>` 타입을 구현하세요.

```ts
type cases = [
  Expect<Equal<Filter<[0, 1, 2], 2>, [2]>>,
  Expect<Equal<Filter<[0, 1, 2], 0 | 1>, [0, 1]>>,
  Expect<Equal<Filter<[0, 1, 2], Falsy>, [0]>>,
]
```



### 문제 분석

배열로 받아 배열로 반환한다.

Predicate와 equal이 아닌 포함되는 조건으로 배열을 필터링한다.



### 첫번째 접근

```ts
type Filter<T extends any[], P> = 
  T extends [infer First, ...infer Rest]  
    ? First extends P
      ? [First ,...Filter<Rest, P>]
      : Filter<Rest, P>
    : []
```

포함되거나 해당 타입이 되는지 판단은 extends로 가능하기에 

기초적인 방식으로 해도 정답이 맞았다.