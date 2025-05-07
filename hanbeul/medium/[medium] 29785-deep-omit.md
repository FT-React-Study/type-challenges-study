## [medium] 29785. Deep Omit

> View on GitHub: https://tsch.js.org/29785

#### 문제

Implement a type`DeepOmit`, Like Utility types [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys), A type takes two arguments.

> 예시

```ts
type obj = {
  person: {
    name: string;
    age: {
      value: number;
    };
  };
};

type test1 = DeepOmit<obj, "person">; // {}
type test2 = DeepOmit<obj, "person.name">; // { person: { age: { value: number } } }
type test3 = DeepOmit<obj, "name">; // { person: { name: string; age: { value: number } } }
type test4 = DeepOmit<obj, "person.age.value">; // { person: { name: string; age: {} } }
```

#### 문제 설명

- 주어진 객체에서 주어진 키를 제거하는 타입
- 주어진 키가 객체 내부에 중첩되어 있을 경우, 해당 키 또한 제거

#### 시도 1

> 접근 방식

- `S`를 받으면, `.`을 기준으로 나눠서 하나씩 재귀처리
- 더이상 `.`이 없으면, 해당 키를 리턴 (반대로 생각함...)

> 코드

```ts
type DeepOmit<T, S> = S extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? Record<First, DeepOmit<T[First], Rest>>
    : never
  : S extends keyof T
  ? T[S]
  : never;
```

> 실패 이유

- 애시당초 문제를 잘못 파악함... 해당 키만 살리는게 아니라, 해당 키만 날려야하는 것.

#### 시도 2 (정답)

> 접근 방식

- 마찬가지로, 우선 중첩된 키를 재귀로 처리
- 최종적으로 마지막 키만 Omit 처리

> 코드

```ts
type DeepOmit<T, S> = S extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? {
        [K in keyof T]: K extends First ? DeepOmit<T[K], Rest> : T[K];
      }
    : T
  : S extends keyof T
  ? Omit<T, S>
  : T;
```

> 코드 설명

- `S`를 받으면, `.`을 기준으로 나눔(First, Rest)
- T의 키 요소를 순회하며, 만약 해당 키가 First와 일치하는 경우, `DeepOmit<T[K], Rest>`을 재귀적으로 호출
- 만약 일치하지 않는 경우, 해당 키를 그대로 리턴
- `S`가 `.`가 없을 경우(마지막 프로퍼티인 경우), `Omit<T, S>` 처리
