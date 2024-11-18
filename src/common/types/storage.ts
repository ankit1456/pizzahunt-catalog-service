export interface IFileData {
  filename: string;
  fileData: ArrayBuffer;
  folder?: string;
}

export interface IUploadedImage {
  imageId: string;
  url: string;
}

export interface IFileStorage {
  upload(data: IFileData): Promise<IUploadedImage>;
  delete(filename: string | undefined): Promise<void>;
  getObjectURI(filename: string): string;
}
