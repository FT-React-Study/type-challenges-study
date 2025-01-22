# Week 3

## Get Return Type

내장 제네릭 `ReturnType<T>`을 이를 사용하지 않고 구현하세요.

예시:

```ts
const fn = (v: boolean) => {
  if (v)
    return 1
  else
    return 2
}

type a = MyReturnType<typeof fn> // should be "1 | 2"
```

```ts
type cases = [
  Expect<Equal<string, MyReturnType<() => string>>>,
  Expect<Equal<123, MyReturnType<() => 123>>>,
  Expect<Equal<ComplexObject, MyReturnType<() => ComplexObject>>>,
  Expect<Equal<Promise<boolean>, MyReturnType<() => Promise<boolean>>>>,
  Expect<Equal<() => 'foo', MyReturnType<() => () => 'foo'>>>,
  Expect<Equal<1 | 2, MyReturnType<typeof fn>>>,
  Expect<Equal<1 | 2, MyReturnType<typeof fn1>>>,
]

type ComplexObject = {
  a: [12, 'foo']
  bar: 'hello'
  prev(): number
}

const fn = (v: boolean) => v ? 1 : 2
const fn1 = (v: boolean, w: any) => v ? 1 : 2
```

### 문제 분석

해당 타입 제네릭에 함수 타입이 들어갈 경우 그 return 타입을 반환하는 유틸리티 타입으로 보인다.

조건문으로 반환하는 경우 그 조건문에 양쪽에서 반환가능한 답을 유니온 타입으로 반환한다.



### 첫번째 접근

```ts
type MyReturnType<T> = T extends (...arg:any[]) => (infer P) ? MyReturnType<P> : T
```

Awaited 유틸리티 타입의 형태를 참고해서 infer를 재귀하는 방식으로 구성했다.

연쇄적으로 작동하는 함수의 리턴타입을 반환하지는 못했다

오히려 조건부로 반환하는 타입을 유니온타입으로 반환하는 동작은 안될 줄 알았는데 반환했다.



### 두번째 접근

```ts
type MyReturnType<T> = T extends (...args: any[]) => (infer P) ? P : never
```

문제 이해를 잘못한 것이었다

마지막 반환 타입을 반환하는걸로 이해했는데 그냥 첫번째 반환값을 가져오면 되는 것이었다.



