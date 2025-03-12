type IntersectionToObj<T> = {
  [K in keyof T]: T[K];
};

type RequiredByKeys<T, K extends keyof T = never> = [K] extends [never]
  ? Required<T>
  : IntersectionToObj<
      {
        [Key in keyof T as Key extends K ? Key : never]-?: T[Key];
      } & {
        [Key in Exclude<keyof T, K>]: T[Key];
      }
    >;

interface User {
  name?: string;
  age?: number;
  address?: string;
}

type UserRequiredName = RequiredByKeys<User, "name">; // { name: string; age?: number; address?: string }

interface UserRequiredName1 {
  name: string;
  age?: number;
  address?: string;
}

interface UserRequiredNameAndAge {
  name: string;
  age: number;
  address?: string;
}

type RequiredByKeysTest0 = RequiredByKeys<User, "name">; // UserRequiredName
type RequiredByKeysTest1 = RequiredByKeys<User, "name" | "age">; // UserRequiredNameAndAge
type RequiredByKeysTest2 = RequiredByKeys<User>; // Required<User>
// @ts-expect-error
type RequiredByKeysTest4 = RequiredByKeys<User, "name" | "unknown">; // UserRequiredName1
