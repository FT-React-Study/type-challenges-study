## 62-Type-Lookup

> View on GitHub: https://tsch.js.org/62

### 문제

때때로 유니온 타입의 특정 속성을 기준으로 조회할 수도 있습니다.

이 챌린지에서는 유니온 타입 `Cat | Dog`에서 공통으로 사용하는 `type` 필드를 기준으로 해당하는 타입을 얻고자 합니다. 다시 말해서, 다음 예시에서는 `LookUp<Cat | Dog, 'dog'>`으로 `Dog` 타입을, `LookUp<Cat | Dog, 'cat'>`으로 `Cat` 타입을 얻을 수 있습니다.

```ts
interface Cat {
  type: "cat";
  breeds: "Abyssinian" | "Shorthair" | "Curl" | "Bengal";
}

interface Dog {
  type: "dog";
  breeds: "Hound" | "Brittany" | "Bulldog" | "Boxer";
  color: "brown" | "white" | "black";
}

type MyDogType = LookUp<Cat | Dog, "dog">; // 기대되는 결과는 `Dog`입니다.
```

### 정답

```ts
type LookUp<U, T> = U extends { type: T } ? U : never;
```

### 설명

- 유니온 타입으로 주어지는 `U`를 분배법칙을 이용해 타입 조회
- `U`가 `{ type: T }` 형태를 포함하는지 확인
- 포함한다면 `U`를 반환
- 포함하지 않는다면 `never` 반환

### 추가 질문

### Reference
