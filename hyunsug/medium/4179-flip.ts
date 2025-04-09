// No need to support nested objects and values which cannot be object keys such as arrays
type Flip<T extends Record<any, any>> = {
  [K in keyof T as T[K] extends keyof any ? T[K] : `${T[K]}`]: K;
};
