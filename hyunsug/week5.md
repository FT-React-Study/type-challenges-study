# Week 5

## [Medium-110-Capitalize](./medium/110-capitalize.ts)

```ts
type MyCapitalize<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : S;
```

- 이는 TypeScript 내장 타입 `Uppercase<T>`를 사용하여 첫번째 문자를 대문자로 변환한다.
- 내장 타입을 사용하지 않는다고 한다면, 소문자-대문자를 key-value로 갖는 interface 혹은 type을 이용하는 방법도 가능하다.
- `Uppercase<T>`, `Lowercase<T>`와 같은 내장 타입들은 타입스크립트 컴파일러 코드를 보면 JS 내장 메서드를 호출하는 것을 확인할 수 있다.

```ts
// typescript github repo: src/compiler/checker.ts:13569
function applyStringMapping(symbol: Symbol, str: string) {
  switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
    case IntrinsicTypeKind.Uppercase:
      return str.toUpperCase();
    case IntrinsicTypeKind.Lowercase:
      return str.toLowerCase();
    case IntrinsicTypeKind.Capitalize:
      return str.charAt(0).toUpperCase() + str.slice(1);
    case IntrinsicTypeKind.Uncapitalize:
      return str.charAt(0).toLowerCase() + str.slice(1);
  }
  return str;
}
```

## [Medium-116-Replace](./medium/116-replace.ts)

```ts
type Replace<
  S extends string,
  From extends string,
  To extends string
> = From extends ""
  ? S
  : S extends `${infer Pre}${From}${infer Rest}`
  ? `${Pre}${To}${Rest}`
  : S;
```

- 문자열 S에서 From을 To로 치환한다.
- From이 빈 문자열인 경우 S를 그대로 반환한다.
- S가 From을 포함하지 않는 경우에도 S를 그대로 반환한다.
- From은 한번만, 앞에서부터 찾아 교체한다.
- `infer Pre`를 통해 From의 앞 문자열을, `infer Rest`를 통해 From의 뒷 문자열을 추출한다.

## [Medium-119-ReplaceAll](./medium/119-replace-all.ts)

```ts
type ReplaceAll<
  S extends string,
  From extends string,
  To extends string
> = From extends ""
  ? S
  : S extends `${infer Pre}${From}${infer Rest}`
  ? `${Pre}${To}${ReplaceAll<Rest, From, To>}`
  : S;
```

- Replace와 동일한 과정을 따른다.
- 단, Replace를 거친 후 남은 From, To의 교체도 일어나야 하므로 ReplaceAll을 Rest에 대해 재귀적으로 호출한다.

## [Medium-191-AppendArgument](./medium/191-append-argument.ts)

```ts
type FunctionBase = (...args: any[]) => any;

type AppendArgument<Fn extends FunctionBase, NewArgument> = Fn extends (
  ...args: infer Args
) => infer Return
  ? (...args: readonly [...Args, x: NewArgument]) => Return
  : never;
```

- extends에 사용할 함수 타입을 정의했다. (`Fn extends (...args: any[]) => any`를 적으면 너무 길어져서)
- 여기에서 `Fn extends FunctionBase`를 통해 Fn은 함수 타입이어야만 한다는 것을 명시한다.
- `Fn extends (...args: infer Args) => infer Return`을 통해 Fn의 기존 Parameters와 Return Type을 추출한다.
- `(...args: readonly [...Args, x: NewArgument]) => Return`을 통해 NewArgument가 Parameters의 마지막에, x라는 이름으로 추가된 타입을 갖는 새로운 함수 타입을 반환한다.
- x를 부여한 이유는 예시가 x라는 key로 parameter 타입을 지정하고 있었기 때문이며, 따로 부여하지 않으면 arg_2로 생성된다.

## [Medium-296-Permutation](./medium/296-permutation.ts)

**다시 보고 이해할 필요가 있음**
[참고1](https://github.com/type-challenges/type-challenges/issues/614)
[참고2](https://ghaiklor.github.io/type-challenges-solutions/en/medium-permutation.html)

- 주어진 유니언에 기반하여 "순열"의 유니언을 만드는 타입으로, 주어진 유니언의 모든 요소를 순서를 바꿔가며 조합한 것을 유니언으로 반환한다.
- 유니언 타입의 평가 시 분배되어 평가된다는 점을 이해하는 것이 중요했다

```ts
type Permutation<T, Original = T> = [T] extends [never]
  ? []
  : T extends Original
  ? [T, ...Permutation<Exclude<Original, T>>]
  : [];
```

### `[T] extends [never]`

- 유니언 T가 순수한 `never` 타입인 경우를 평가하기 위한 조건이다.
- 유니언 T는 분배되어 평가되며, `never` 타입은 분배 시 공집합으로 간주되어 평가에서 제외된다.
- 따라서, `never` 타입을 명시적으로 평가하기 위해서는 `never` 이전에 평가를 진행하도록 강제해야 한다.
- 이를 위해 튜플 타입으로 묶어 평가를 진행하도록 한다.

### `Original = T`, `T extends Original`

- 유니언 T는 분배되어 평가된다. 원래는 `T extends infer U` 형태를 통해 유니언의 요소를 이용하려 했다.
- 하지만 해당 형태는 이미 분배된 유니언의 각 요소가 T가 되어 U는 T와 동일한 타입이 되고,
- 재귀를 실행하기 위해 Exclude를 실행할 때 분배된 요소 T에서 T를 제거하여 탈출 조건이 된다

- 따라서, 원래 유니언을 보존하고 있는 복사된 제너릭을 추가하는 것이 필요했다.
- `T extends Original`은 원래 유니언의 요소인 T가 Original(원래 유니언)의 부분 집합인 경우에 성립한다.
- `[T, ...Permutation<Exclude<Original, T>>]`는 분배된 요소 T를 시작으로 하는 튜플을 생성하며
- 재귀적으로 원래 유니언에서 분배된 요소 T를 제거하고 나머지 유니언에 대해 다시 Permutation을 실행한다.

## [Medium-298-LengthOfString](./medium/298-length-of-string.ts)

```

```
