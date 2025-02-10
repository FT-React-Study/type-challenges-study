# week6

## Flatten

주어진 배열을 플랫한 배열 타입으로 바꾸는 Flatten 타입을 구현하세요.

예시:

```ts
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
```

```ts
type cases = [
  Expect<Equal<Flatten<[]>, []>>,
  Expect<Equal<Flatten<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<Flatten<[1, [2]]>, [1, 2]>>,
  Expect<Equal<Flatten<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, 5]>>,
  Expect<Equal<Flatten<[{ foo: 'bar', 2: 10 }, 'foobar']>, [{ foo: 'bar', 2: 10 }, 'foobar']>>,
]
```



### 문제 분석

배열안에 배열이 있을 경우 해당 배열의 원소를 다 풀어서 1차 배열로 정리한다.



### 첫번째 접근

재귀를 사용해야 한다 생각했고 infer 재귀로 요소를 하나씩 체크하면서 그 요소가 배열일 경우 Flatten을 재귀로 걸고자 했다

```ts
type Flatten<T> = T extends [infer First, ...infer Rest] ? [First extends Array<any> ? Flatten<First>: First, ...Flatten<Rest>] : []
```



### 두번째 접근 - 정답

```ts
type Flatten<T extends Array<any>> = T extends [infer First, ...infer Rest] 
  ? (First extends Array<any> 
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]) 
  : []
```

스프레드 연산자와 함께 넣어줬더니 해결이 됐다

