type Unshift<T extends unknown[], U> = [U, ...T];

// Original
type UnshiftResult = Unshift<[1, 2], 0>; // [0, 1, 2]
