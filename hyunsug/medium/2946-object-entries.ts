type ObjectEntries<T> = {
  [K in keyof T]-?: [
    K,
    T[K] extends undefined ? T[K] : Exclude<T[K], undefined>
  ];
}[keyof T];

interface EntryModel {
  name: string;
  age: number;
  locations: string[] | null;
}

// ['name', string] | ['age', number] | ['locations', string[] | null];
type modelEntries = ObjectEntries<EntryModel>;

type ModelEntries =
  | ["name", string]
  | ["age", number]
  | ["locations", string[] | null];

type ObjectEntriesTest0 = ObjectEntries<EntryModel>; // ModelEntries
type ObjectEntriesTest1 = ObjectEntries<Partial<EntryModel>>; // ModelEntries
type ObjectEntriesTest2 = ObjectEntries<{ key?: undefined }>; // ['key', undefined]
type ObjectEntriesTest3 = ObjectEntries<{ key: undefined }>; // ['key', undefined]
type ObjectEntriesTest4 = ObjectEntries<{ key: string | undefined }>; // ['key', string | undefined]
