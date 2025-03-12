// divide and conquer
// 1. never라면 빈 배열을, 아니라면 유니언 T의 요소가 분배된 튜플 [T] 유니언이 된다.
// type Permutation<T> = T extends never ? [] : [T];

// 이 때 생각해야 하는것은 SomeType extends never는 어떤 타입이어도 성립하지 않는다는 것
// never를 extends하는 타입은 없다는 것
// 따라서 never를 명시적으로 평가하기 위해서는 튜플 타입으로 묶어서 평가해야 한다.
// type Permutation<T> = [T] extends [never] ? [] : [T];

// 혹은 유니언 타입 T에 대해 이 T가 'never'인지를 정확하게 판별하는 방식으로
// 유니언 타입 T의 분배가 일어나지 않게 튜플로 묶어서 튜플대 튜플로 타입을 비교하는 방식을 사용할 수 있다
// [T] extends [never]를 진행하면 [유니언 T] extends [never]를 진행하게 된다.
// 이는 Equal<A, B>에서 사용하는 함수 형태로 타입을 비교하는 것과 유사하다

// 2. 유니언 타입은 분배되어 평가되는 특성을 이용한다.
// 따라서 다음과 같이 진행하면 유니언 타입의 각 요소가 튜플로 변환되어 유니언을 생성한다.
// type Permutation<T> = [T] extends [never] ? [] : T extends infer U ? [U] : [];
// 이 방법은 각 유니언의 요소에 대한 튜플을 생성할 수는 있으나 T extends infer U가 실행되는 시점에
// T는 원래 유니언의 각 요소로 분배된 상태이므로 순열을 구성할 수는 없다.

// 3. 먼저 분배된 유니언의 요소를 제외한 나머지 타입을 추출하여 사용한다.
// U로 추출되지 않은 유니언의 나머지 요소는 Exclude<T, U>를 통해 얻을 수 있다.
type Permutation<T, Original = T> = [T] extends [never]
  ? []
  : T extends Original
  ? [T, ...Permutation<Exclude<Original, T>>]
  : [];

type perm = Permutation<"A" | "B" | "C">; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']

type PermTest1 = Permutation<"A">; // ['A']
type PermTest2 = Permutation<"A" | "B" | "C">; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
type PermTest3 = Permutation<"B" | "A" | "C">; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
type PermTest4 = Permutation<boolean>; // [false, true] | [true, false]
type PermTest5 = Permutation<never>; // []

type UnionToTuple<U> = [U];

type TestUT = UnionToTuple<"A" | "B" | "C">; // ["A" | "B" | "C"]
type TestUT2 = UnionToTuple<never>; // [never]
