export interface IFileData {
  filename: string;
  fileData: ArrayBuffer;
}

export interface IFileStorage {
  upload(data: IFileData): Promise<void>;
  delete(filename: string): void;
  getObjectURI(filename: string): string;
}
