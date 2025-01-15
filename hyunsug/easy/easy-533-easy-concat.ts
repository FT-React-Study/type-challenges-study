type Concat<T extends any[], U extends any[]> = [...T, ...U];

// Original
type Merged = Concat<[1], [2]>; // expected to be [1, 2]
