import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { IFileData, IFileStorage } from '@common/types';
import config from 'config';

export default class S3Storage implements IFileStorage {
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
  async delete(filename: string | undefined): Promise<void> {
    const objectParams = {
      Bucket: config.get('s3.bucket') as string,
      Key: filename
    };

    await this.client.send(new DeleteObjectCommand(objectParams));
  }

  getObjectURI(): string {
    throw new Error('Method not implemented.');
  }
}
