# Week 18

## [Medium-28333-PublicType](./medium/28333-public-type.ts)

```ts
type PublicType<T extends object> = {
  [K in keyof T as K extends `_${any}` ? never : K]: T[K];
};
```

- key가 `_`로 시작하는 경우 제외하고 나머지만을 반환하는 형태,
- `as`를 통해 K를 다시 검증하는 방식을 이용할 수 있고, K를 문자열 템플릿 패턴매칭을 통해 조건을 파악할 수 있다
- `_`로 시작하는 경우 `never`를 이용하여 반환되는 객체에 포함되지 않도록 한다.

## [Medium-29650-ExtractToObject](./medium/29650-extract-to-object.ts)

```ts
type Merge<T> = {
  [K in keyof T]: T[K];
};

type ExtractToObject<T, U extends keyof T> = Merge<Omit<T, U> & T[U]>;
```

- 예제에 따라 T의 key가 아닌 것이 U에 들어오면 에러 표기가 되어야 하기 때문에 `U extends keyof T`를 이용
- T에서 먼저 U를 제거하고, T[U]를 통해 객체를 얻고, 이를 Intersection한 후, Merge 헬퍼 타입으로 하나의 객체 타입으로 변환한다
