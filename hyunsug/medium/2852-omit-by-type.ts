type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

type OmitBoolean = OmitByType<
  {
    name: string;
    count: number;
    isReadonly: boolean;
    isEnable: boolean;
  },
  boolean
>; // { name: string; count: number }

interface Model {
  name: string;
  count: number;
  isReadonly: boolean;
  isEnable: boolean;
}

type OmitByTypeTest = OmitByType<Model, boolean>; // { name: string, count: number }
type OmitByTypeTest2 = OmitByType<Model, string>; // { count: number, isReadonly: boolean, isEnable: boolean }
type OmitByTypeTest3 = OmitByType<Model, number>; // { name: string, isReadonly: boolean, isEnable: boolean }
