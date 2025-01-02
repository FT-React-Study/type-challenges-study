  /*
    4 - Pick
    -------
    by Anthony Fu (@antfu) #쉬움 #union #built-in

    ### 질문

    `T`에서 `K` 프로퍼티만 선택해 새로운 오브젝트 타입을 만드는 내장 제네릭 `Pick<T, K>`을 이를 사용하지 않고 구현하세요.

    예시:

    ```ts
    interface Todo {
      title: string
      description: string
      completed: boolean
    }

    type TodoPreview = MyPick<Todo, 'title' | 'completed'>

    const todo: TodoPreview = {
        title: 'Clean room',
        completed: false,
    }
    ```

    > GitHub에서 보기: https://tsch.js.org/4/ko
  */

  /* _____________ 여기에 코드 입력 _____________ */

  /* 
  * type MyPick<T, K> = any 
  */

  // Pick은 상속?받는 타입에서 특정 속성들만 가져오는것
  // 문제가 처음에는 뭐하라는건지 모르겠어서 답 확인
  type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  // 단계별로 이해하면
  // key of : 객체 타입의 키들의 유니온 타입을 반환
  type K = keyof Todo
  // "title" | "description" | "completed"

  // extends: 제네릭의 연산자로 뒤에 나오는 타입의 하위 타입으로 제한하는 것
  // 즉 K 제네릭을 T의 하위 타입으로 제한하고 아닐 때 오류가 나야 한다.
  // 근데 답들에 댓글들을 보는데 무슨 버전에서는 에러가 아니다 하는데 일단 여기서는 에러가 나긴한다

  // [k in K] : K의 값들을 하나씩 순회하는 것, K가 유니온 타입이기 때문에 그 값들을 하나씩 순회한다
  type todoKey = {
    [k in K] : any
  }
  // {
  //   title : any,
  //   description: any,
  //   completed: any
  // }

  // T[k] : 키를 통한 타입접근, 객체 타입 T중에서 k라는 키의 타입을 가져온다
  type titleType = Todo['title']
  // string

  // type MyPick<T, K extends keyof T> = {
  //   [P in K]: T[P];
  // };

  // 최종적으로 이건 K의 값들을 제네릭을 통해 T의 키들의 하위집합으로 제한하고, 그 집합을 순회하면서 T에서 해당 키의 타입으로 할당하는 것이다 

  /* _____________ 테스트 케이스 _____________ */
  import type { Equal, Expect } from '@type-challenges/utils'

  type cases = [
    Expect<Equal<Expected1, MyPick<Todo, 'title'>>>,
    Expect<Equal<Expected2, MyPick<Todo, 'title' | 'completed'>>>,
    MyPick<Todo, 'title' | 'completed' | 'invalid'>,
  ]

  interface Todo {
    title: string
    description: string
    completed: boolean
  }

  interface Expected1 {
    title: string
  }

  interface Expected2 {
    title: string
    completed: boolean
  }

  /* _____________ 다음 단계 _____________ */
  /*
    > 정답 공유하기: https://tsch.js.org/4/answer/ko
    > 정답 보기: https://tsch.js.org/4/solutions
    > 다른 문제들: https://tsch.js.org/ko
  */
