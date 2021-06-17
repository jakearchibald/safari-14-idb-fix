interface IDBDatabaseInfo {
  name: string;
  version: number;
}

interface IDBFactory {
  databases(): Promise<IDBDatabaseInfo[]>;
}
