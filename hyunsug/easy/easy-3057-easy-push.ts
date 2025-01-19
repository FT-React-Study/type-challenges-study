type Push<T extends unknown[], U> = [...T, U];

// Original
type NewArrayType = Push<[1, 2], "3">; // [1, 2, '3']
