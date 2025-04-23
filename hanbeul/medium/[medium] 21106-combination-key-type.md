## [medium] 21106. Combination Key Type

> View on github: https://tsch.js.org/21106

#### 문제

1. Combine multiple modifier keys, but the same modifier key combination cannot appear.
2. In the `ModifierKeys` provided, the priority of the previous value is higher than the latter value; that is, `cmd ctrl` is OK, but `ctrl cmd` is not allowed.

#### 문제 설명

- 여러 키를 조합해서 새로운 키를 만들어야 함
- 조합된 키는 중복되지 않아야 함
- 조합된 키는 순서가 있어야 함(앞선 키가 우선 순위가 높음)

#### 시도 1

> 접근 방식

- 기존 콤비네이션 코드 차용

> 코드

```ts
type MakeCombination<A extends string, B extends string> = `${A} ${B}`;

type UnionCombination<A extends string, B extends string = A> = [A] extends [
  never
]
  ? ""
  : A extends B
  ? MakeCombination<A, UnionCombination<Exclude<B, A>>>
  : never;

type Combs<T extends any[]> = UnionCombination<T[number]>;
```

> 실패 이유

- 조합이 아니라, 마치 순열처럼 모든 경우의 수가 합쳐져서 나옴

#### 시도 2 (답지 참고)

> 코드

```ts
type Combs<T extends string[] = ModifierKeys> = T extends [
  infer F extends string,
  ...infer R extends string[]
]
  ? `${F} ${R[number]}` | Combs<R>
  : never;
```

> 코드 설명

- `F`와 나머지 `R`의 요소들을 묶은 string 리턴
- 이후 `R`를 순회하면서 계속 조합
