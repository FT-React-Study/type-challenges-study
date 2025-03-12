type Shift<T extends readonly any[]> = T extends [infer _, ...infer R] ? R : [];

type Result = Shift<[3, 2, 1]>; // [2, 1]

// @ts-expect-error
type ShiftTest0 = Shift<unknown>;
type ShiftTest1 = Shift<[]>; // []
type ShiftTest2 = Shift<[1]>; // []
type ShiftTest3 = Shift<[3, 2, 1]>; // [2, 1]
type ShiftTest4 = Shift<["a", "b", "c", "d"]>; // ['b', 'c', 'd']
