type DeepOmit<T, DeepKey extends string> = DeepKey extends keyof T
  ? Omit<T, DeepKey>
  : DeepKey extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? {
        [P in keyof T]: P extends K ? DeepOmit<T[P], Rest> : T[P];
      }
    : T
  : T;
