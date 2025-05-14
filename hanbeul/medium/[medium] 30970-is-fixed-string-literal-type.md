## [medium] 30970. Is Fixed String Literal Type

> View on GitHub: https://tsch.js.org/30970

#### 문제

Sometimes you may want to determine whether a string literal is a definite type. For example, when you want to check whether the type specified as a class identifier is a fixed string literal type.

```typescript
type Action<ID extends string> = { readonly id: ID };
```

Since it must be fixed, the following types must be determined as false.

- never type
- Union of string literal types
- Template literal types with embedded string, number, bigint, boolean

Determine whether the given type S is a definite string literal type.

#### 문제 설명

- 이 문제는 문자열 리터럴 타입이 확실한 타입인지 확인하는 문제
- 예를 들어, 클래스 식별자로 지정된 타입이 고정된 문자열 리터럴 타입인지 확인

#### 시도 1 (답지 참조)

> 접근 방식

- 타입 조합 활용

> 코드

```ts
type MyEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type IsFixedStringLiteralType<S extends string> = {} extends Record<S, 1>
  ? false
  : MyEqual<[S], S extends unknown ? [S] : never>;
```

> 코드 설명

- `{} extends Record<S, 1>`: S가 일반적인 `string`인지 체크하는 필터 역할(동적 문자열 타입 제외)
- `abc`, `123` 등 고정된 문자열 타입은 `{} extends Record<S, 1>` 타입을 만족하지 않음
- `MyEqual<[S], S extends unknown ? [S] : never>`: S가 유니온 타입인지 확인(extends unknown이 true일 경우 유니온 분해)
