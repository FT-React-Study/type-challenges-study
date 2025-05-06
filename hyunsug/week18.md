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
