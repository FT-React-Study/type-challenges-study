type PickByType<T, Picker> = {
  [K in keyof T as T[K] extends Picker ? K : never]: T[K];
};

type OnlyBoolean = PickByType<
  {
    name: string;
    count: number;
    isReadonly: boolean;
    isEnable: boolean;
  },
  boolean
>; // { isReadonly: boolean; isEnable: boolean; }

interface Model {
  name: string;
  count: number;
  isReadonly: boolean;
  isEnable: boolean;
}

type PickTest0 = PickByType<Model, boolean>; // { isReadonly: boolean, isEnable: boolean }
type PickTest1 = PickByType<Model, string>; // { name: string }
type PickTest2 = PickByType<Model, number>; // { count: number }
