type IntersectionToObj<T> = {
  [K in keyof T]: T[K];
};

type PartialByKeys<T, K extends keyof T = never> = [K] extends [never]
  ? Partial<T>
  : IntersectionToObj<
      {
        [Key in keyof T as Key extends K ? Key : never]+?: T[Key];
      } & {
        [Key in Exclude<keyof T, K>]: T[Key];
      }
    >;

interface User {
  name: string;
  age: number;
  address: string;
}

type UserPartialName = PartialByKeys<User, "name">; // { name?:string; age:number; address:string }

interface User {
  name: string;
  age: number;
  address: string;
}

interface UserPartialName1 {
  name?: string;
  age: number;
  address: string;
}

interface UserPartialNameAndAge {
  name?: string;
  age?: number;
  address: string;
}

type PartialByKeysTest0 = PartialByKeys<User, "name">; // UserPartialName>>,
type PartialByKeysTest1 = PartialByKeys<User, "name" | "age">; // UserPartialNameAndAge>>,
type PartialByKeysTest2 = PartialByKeys<User>; // Partial<User>
// @ts-expect-error
type PartialByKeysTest3 = PartialByKeys<User, "name" | "unknown">; // UserPartialName1
