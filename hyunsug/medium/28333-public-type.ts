type PublicType<T extends object> = {
  [K in keyof T as K extends `_${any}` ? never : K]: T[K];
};
