## [medium] 18142. All

> View on GitHub: https://tsch.js.org/18142

#### 문제

Returns true if all elements of the list are equal to the second parameter passed in, false if there are any mismatches.

> 예시

```ts
type Test1 = [1, 1, 1];
type Test2 = [1, 1, 2];

type Todo = All<Test1, 1>; // should be same as true
type Todo2 = All<Test2, 1>; // should be same as false
```

#### 문제 설명

- 배열을 받아, 배열의 모든 요소가 두 번째 파라미터와 같은지 확인

#### 시도 1

> 접근 방식

- 배열을 순회하면서 두 번째 파라미터와 같은지 확인
- 같지 않으면 false 반환
- 모두 같으면 true 반환

> 코드

```ts
type MyEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type All<T extends any[], U> = T extends [infer First, ...infer Rest]
  ? MyEqual<First, U> extends true
    ? All<Rest, U>
    : false
  : true;
```

> 코드 설명

- 배열을 순회하면서 두 번째 파라미터와 같은지 확인 (MyEqual 함수 사용)
- 같지 않으면 false 반환
- 모두 같으면 true 반환
