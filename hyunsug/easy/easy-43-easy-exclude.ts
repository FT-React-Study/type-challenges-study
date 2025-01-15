type MyExclude<T, U> = T extends U ? never : T;

// Original Question
type Result = MyExclude<"a" | "b" | "c", "a">; // 'b' | 'c'
