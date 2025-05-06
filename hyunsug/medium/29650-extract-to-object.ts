type Merge<T> = {
  [K in keyof T]: T[K];
};

type ExtractToObject<T, U extends keyof T> = Merge<Omit<T, U> & T[U]>;
