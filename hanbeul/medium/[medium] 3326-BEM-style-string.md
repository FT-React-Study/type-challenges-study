# 3326 - BEM-style-string

## 문제

Block, Element, Modifier 방법론(BEM)은 CSS에서 클래스 명명에 널리 사용되는 규칙입니다.

예를 들어, 블록 컴포넌트는 `btn`으로 표현되고, 블록에 종속된 엘리먼트는 `btn__price`로 표현되며, 블록의 스타일을 변경하는 수정자는 `btn--big` 또는 `btn__price--warning`으로 표현됩니다.

`BEM<B, E, M>`을 구현하세요. 이는 세 개의 매개변수로부터 문자열 유니온을 생성합니다. 여기서 `B`는 문자열 리터럴이고, `E`와 `M`은 문자열 배열입니다(비어있을 수 있음).

> 예시

```typescript
type a = BEM<"btn", ["price"], []>; // 'btn__price'
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- 주어진 E, M을 각각 순회하면서 합쳐서 보여줄 방법을 찾자.
- 문자열 관련된 문제이니, string 리터럴 타입을 고려해보자.

> 코드

```typescript
type BEM<
  B extends string,
  E extends string[],
  M extends string[]
> = `${B}${E extends [] ? "" : `__${E[number]}`}${M extends []
  ? ""
  : `--${M[number]}`}`;
```

> 코드 설명

- `E extends [] ? "" : `\_\_${E[number]}`` 형태로 E가 빈 배열인 경우 빈 문자열 반환, 비어있지 않을 경우 순회하여 유니온 요소 각각 생성
- 마찬가지로 M 또한 동일한 로직으로 작동
