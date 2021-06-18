interface IDBDatabaseInfo {
  name: string;
  version: number;
}

interface IDBFactory {
  databases(): Promise<IDBDatabaseInfo[]>;
}

interface Navigator {
  // In reality it has properties and such, but for the sake of this lib:
  userAgentData?: {};
}
