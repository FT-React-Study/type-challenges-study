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





