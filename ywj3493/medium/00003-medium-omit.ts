/*
  3 - Omit
  -------
  by Anthony Fu (@antfu) #보통 #union #built-in

  ### 질문

  `T`에서 `K` 프로퍼티만 제거해 새로운 오브젝트 타입을 만드는 내장 제네릭 `Omit<T, K>`를 이를 사용하지 않고 구현하세요.

  예시:

  ```ts
  interface Todo {
    title: string
    description: string
    completed: boolean
  }

  type TodoPreview = MyOmit<Todo, 'description' | 'title'>

  const todo: TodoPreview = {
    completed: false,
  }
  ```

  > GitHub에서 보기: https://tsch.js.org/3/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

// keyof T 를 as P 로 단언해야하는 이유가 무엇일까?
// keyof 타입 연산자: 객체 타입에서 객체 키 값들을 숫자나 문자열 리터럴 유니언 타입으로 return 한다.
// as 타입 단언: as 가 단순히 타입 단언으로만 사용 되는 것이 아닌 4.1 버전 부터는 매핑된 타입의 키를 다시 매핑할 수 있다.
type MyOmit<T, K> = {
  [Property in keyof T as Property extends K ? never : Property]: T[Property];
};

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<Expected1, MyOmit<Todo, "description">>>,
  Expect<Equal<Expected2, MyOmit<Todo, "description" | "completed">>>,
  Expect<Equal<Expected3, MyOmit<Todo1, "description" | "completed">>>
];

// @ts-expect-error
type error = MyOmit<Todo, "description" | "invalid">;

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

interface Todo1 {
  readonly title: string;
  description: string;
  completed: boolean;
}

interface Expected1 {
  title: string;
  completed: boolean;
}

interface Expected2 {
  title: string;
}

interface Expected3 {
  readonly title: string;
}

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/3/answer/ko
  > 정답 보기: https://tsch.js.org/3/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
