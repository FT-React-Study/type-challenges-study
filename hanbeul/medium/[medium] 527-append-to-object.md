# 527 - AppendToObject

> View on GitHub: https://tsch.js.org/527

## 문제

주어진 인터페이스에 새로운 필드를 추가한 object 타입을 구현하세요. 이 타입은 세 개의 인자를 받습니다.

## 문제 설명

- 인터페이스에 새로운 필드를 추가하는 문제
- 새로운 필드가 추가된 인터페이스는 온전한 타입이어야 함(유니온 타입 등 X)

## 정답

```ts
type AppendToObject<
  T extends object,
  U extends string,
  V,
  MergedObject = T & Record<U, V>,
> = { [P in keyof MergedObject]: MergedObject[P] };
```

## 설명

- `MergedObject`는 `T`와 `Record<U, V>`를 유니온 타입으로 합친 타입
- `[P in keyof MergedObject]`는 `MergedObject`의 모든 키를 순회, `MergedObject[P]`는 `MergedObject`의 각 키에 해당하는 값을 반환
- 이렇게 만들어진 타입 객체를 다시 인터페이스로 반환

## 오답노트

> 1차 시도

```ts
type AppendToObject<T extends object, U, V> = { [P in keyof T]: T[P] } & {
  U: V;
};
type ex1 = AppendToObject<test1, "home", boolean>;
// { key: "cat"; value: "green"; } & { U: boolean; }
```

- `U`가 주어진 타입이 아닌, string `U`가 key 값이 됨
- 또한 이 경우 단순히 유니온 타입을 반환
- 유니온 타입이 아닌 타입을 반환해야 함

> 2차 시도

```ts
type AppendToObject<T extends object, U extends string, V> = {
  [P in keyof T]: T[P];
} & Record<U, V>;
type ex1 = AppendToObject<test1, "home", boolean>;
// { key: "cat"; value: "green"; } & Record<"home", boolean>
```

- `Record`를 활용해 `U`를 key로 하는 객체를 생성
- 여전히 유니온 타입을 반환
