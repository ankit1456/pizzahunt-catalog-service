import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { IFileData, IFileStorage } from '@common/types';
import config from 'config';

export class S3Storage implements IFileStorage {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: config.get('s3.region'),
      credentials: {
        accessKeyId: config.get('s3.accessKeyId'),
        secretAccessKey: config.get('s3.secretAccessKey')
      }
    });
  }
  async upload(data: IFileData): Promise<void> {
    const objectParams = {
      Bucket: config.get('s3.bucket') as string,
      Key: data.filename,
      Body: Buffer.from(data.fileData)
    };

    await this.client.send(new PutObjectCommand(objectParams));
  }
  delete(): void {
    throw new Error('Method not implemented.');
  }
  getObjectURI(): string {
    throw new Error('Method not implemented.');
  }
}
