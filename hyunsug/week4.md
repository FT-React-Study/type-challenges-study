# TS Types - Week 4

## [Medium-15-Last-of-Array](./medium/15-last-of-array.ts)

```ts
type Last<T extends readonly any[]> = T extends [...infer _, infer L]
  ? L
  : never;
```

- rest operator를 사용한다. 마지막 요소를 남기고 나머지 앞부분을 rest로 추출할 수 있다.
- Last of Array이지만 tuple 형태로 주어지는 경우를 함께 처리하기 위해 readonly array를 사용한다.
- 빈 배열이어서 마지막 요소를 추출할 수 없는 경우 never를 반환한다.

## [Medium-16-Pop](./medium/16-pop.ts)

```ts
type Pop<T extends readonly any[]> = T extends [...infer F, infer _] ? F : [];
```

- rest operator 를 사용하여 마지막 요소를 제거하고 나머지 요소를 반환
- 요소가 하나거나 없는 경우 빈 배열을 반환한다.
- `...infer F`는 마지막 요소 전까지의 모든 요소를 캡처하는데 요소가 하나뿐이라면 빈 배열이 된다.
- `infer _`는 마지막 요소를 캡처하는데 요소가 하나뿐이면 그 하나의 요소가 되고, 빈 배열이 된 F가 타입이 된다.
- 원래 빈 배열이라면 infer 구문 두가지가 모두 패턴 매칭에 실패하여 false condition이 된다. 빈 배열 타입을 가지게 한다.

## [Medium-20-Promise-All](./medium/20-promise-all.ts)

## [Medium-62-Type-Lookup](./medium/62-type-lookup.ts)

## [Medium-106-Trim-Left](./medium/106-trim-left.ts)

## [Medium-108-Trim](./medium/108-trim.ts)
