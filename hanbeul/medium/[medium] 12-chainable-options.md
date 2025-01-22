## 12-chainable-options

### 문제

체인 가능 옵션은 일반적으로 Javascript에서 사용됩니다. 하지만 TypeScript로 전환하면 제대로 구현할 수 있나요?

이 챌린지에서는 `option(key, value)`와 `get()` 두가지 함수를 제공하는 객체(또는 클래스) 타입을 구현해야 합니다. 현재 타입을 `option`으로 지정된 키와 값으로 확장할 수 있고 `get`으로 최종 결과를 가져올 수 있어야 합니다.

> 예시

```ts
declare const config: Chainable;

const result = config
  .option("foo", 123)
  .option("name", "type-challenges")
  .option("bar", { value: "Hello World" })
  .get();

// 결과는 다음과 같습니다:
interface Result {
  foo: number;
  name: string;
  bar: {
    value: string;
  };
}
```

문제를 해결하기 위해 js/ts 로직을 작성할 필요는 없습니다. 단지 타입 수준입니다.

`key`는 `string`만 허용하고 `value`는 무엇이든 될 수 있다고 가정합니다. 같은 `key`는 두 번 전달되지 않습니다.

### 풀이

```ts
type Chainable<CurrentConfig = object> = {
  option<OptionKey extends string, OptionValue extends any>(
    key: Exclude<OptionKey, keyof CurrentConfig>,
    value: OptionValue
  ): Chainable<Omit<CurrentConfig, OptionKey> & Record<OptionKey, OptionValue>>;
  get(): CurrentConfig;
};
```

- `CurrentConfig`를 통해 현재까지 설정된 객체를 추적
- `CurrentConfig`는 최초 타입 선언 시 빈 객체로 초기화
- `option` 함수는 새로운 key-value 쌍을 추가
- 이 때 `OptionKey`는 `string`, `OptionValue`는 `any`로 선언
- `Exclude<OptionKey, keyof CurrentConfig>`을 통해 이미 존재하는 key를 제외
- `Omit<CurrentConfig, OptionKey>`을 통해 기존 객체에서 해당 key를 제거
- `Record<OptionKey, OptionValue>`을 통해 새로운 key-value 쌍을 추가
- `Chainable` 타입은 `Omit`과 `Record`를 통해 중복되지 않은 key를 가진 새로운 객체를 반환
- `get` 함수는 최종 결과를 반환

### 추가 질문

> result3에서 왜 에러가 났음에도 number가 리턴되어야 하는 걸까...?

- 이건 그냥 내부 동작에 대한 질문
- 에러가 나면 타입이 안바뀌거나, 아니면 에러가 안나고 타입이 다 바뀌는게 맞지 않나...

### Reference

- [TypeScript 공식 문서 - Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)
- [TypeScript 공식 문서 - Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)
- [Github Answer](https://github.com/type-challenges/type-challenges/issues/15337#issuecomment-2122307643)
