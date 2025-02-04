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

## [Medium-191-AppendArgument](./medium/191-append-argument.ts)

## [Medium-296-Permutation](./medium/296-permutation.ts)

## [Medium-298-LengthOfString](./medium/298-length-of-string.ts)

```

```
