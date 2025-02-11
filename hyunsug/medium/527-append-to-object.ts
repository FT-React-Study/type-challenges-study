type AppendToObject<T, U extends string, V> = {
  [key in keyof T | U]: key extends keyof T ? T[key] : V;
};

type Test = { id: "1" };
type Result = AppendToObject<Test, "value", 4>; // expected to be { id: '1', value: 4 }

type test1 = {
  key: "cat";
  value: "green";
};

type testExpect1 = {
  key: "cat";
  value: "green";
  home: boolean;
};
type TestAppendToObject1 = AppendToObject<test1, "home", boolean>;

type test2 = {
  key: "dog" | undefined;
  value: "white";
  sun: true;
};

type testExpect2 = {
  key: "dog" | undefined;
  value: "white";
  sun: true;
  home: 1;
};
type TestAppendToObject2 = AppendToObject<test2, "home", 1>;

type test3 = {
  key: "cow";
  value: "yellow";
  sun: false;
};

type testExpect3 = {
  key: "cow";
  value: "yellow";
  sun: false;
  moon: false | undefined;
};
type TestAppendToObject3 = AppendToObject<test3, "moon", false | undefined>;
