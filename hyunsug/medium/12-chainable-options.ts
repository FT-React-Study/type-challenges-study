// 첫번째 방법, 동일 key에 의한 override가 가능하다.
// type Chainable<T = {}> = {
//   option: <K extends string, V extends any>(
//     key: K,
//     value: V
//   ) => Chainable<T & { [Key in K]: V }>;
//   get: () => T;
// };

// key는 string만 허용하고 value는 무엇이든 될 수 있다고 가정합니다. 같은 key는 두 번 전달되지 않습니다.

type Chainable<T = {}> = {
  option: <K extends string, V extends any>(
    key: Exclude<K, keyof T>,
    value: V
  ) => Chainable<Omit<T, K> & { [Key in K]: V }>;
  get: () => T;
};

declare const config: Chainable;

const result = config
  .option("foo", 123)
  .option("name", "type-challenges")
  .option("bar", { value: "Hello World" })
  .get();

// expect the type of result to be:
interface CResult {
  foo: number;
  name: string;
  bar: {
    value: string;
  };
}

// Test Cases

declare const a: Chainable;

const result1 = a
  .option("foo", 123)
  .option("bar", { value: "Hello World" })
  .option("name", "type-challenges")
  .get();

const result2 = a
  .option("name", "another name")
  // @ts-expect-error
  .option("name", "last name")
  .get();

type TTX = typeof result2 extends CExpected2 ? true : false;

const result3 = a
  .option("name", "another name")
  // @ts-expect-error
  .option("name", 123)
  .get();

type TXX = typeof result3 extends Expected3 ? true : false;

type CExpected1 = {
  foo: number;
  bar: {
    value: string;
  };
  name: string;
};

type CExpected2 = {
  name: string;
};

type Expected3 = {
  name: number;
};
