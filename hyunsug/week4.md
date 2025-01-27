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

## [Medium-20-Promise-All](./medium/20-promise-all.ts)

## [Medium-62-Type-Lookup](./medium/62-type-lookup.ts)

## [Medium-106-Trim-Left](./medium/106-trim-left.ts)

## [Medium-108-Trim](./medium/108-trim.ts)
