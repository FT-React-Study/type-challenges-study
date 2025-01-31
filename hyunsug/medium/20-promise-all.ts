declare function PromiseAll<T extends readonly any[] | []>(
  values: readonly [...T]
): Promise<{
  [K in keyof T]: Awaited<T[K]>;
}>;

const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});

// expected to be `Promise<[number, 42, string]>`
const p = PromiseAll([promise1, promise2, promise3] as const);

const promiseAllTest1 = PromiseAll([1, 2, 3] as const);
const promiseAllTest2 = PromiseAll([1, 2, Promise.resolve(3)] as const);
const promiseAllTest3 = PromiseAll([1, 2, Promise.resolve(3)]);
const promiseAllTest4 = PromiseAll<Array<number | Promise<number>>>([1, 2, 3]);

type PromiseAllTest1 = typeof promiseAllTest1; // Promise<[1, 2, 3]>>>,
type PromiseAllTest2 = typeof promiseAllTest2; // Promise<[1, 2, number]>>>,
type PromiseAllTest3 = typeof promiseAllTest3; // Promise<[number, number, number]>>>,
type PromiseAllTest4 = typeof promiseAllTest4; // Promise<number[]>>>,

// Promise 타입의 평탄화
const p1 = Promise.resolve(Promise.resolve(100));

// p1의 타입이 어떻게 추론되는지 확인
type P1Type = typeof p1; // Promise<number>
