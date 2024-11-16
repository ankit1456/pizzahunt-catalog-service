import { IFileData, IFileStorage } from '@common/types';
import { v2 as cloudinary } from 'cloudinary';
import config from 'config';
import { PassThrough } from 'stream';

export default class CloudinaryStorage implements IFileStorage {
  constructor() {
    cloudinary.config({
      cloud_name: config.get('cloudinary.cloud_name'),
      api_key: config.get('cloudinary.api_key'),
      api_secret: config.get('cloudinary.api_secret')
    });
  }

  // async upload(data: IFileData): Promise<void> {
  //   await cloudinary.uploader.upload(
  //     `data:image/jpeg;base64,${Buffer.from(data.fileData).toString('base64')}`,
  //     {
  //       resource_type: 'auto',
  //       public_id: data.filename,
  //       folder: 'pizzahunt/products'
  //     }
  //   );
  // }

  async upload(data: IFileData): Promise<void> {
    await new Promise((resolve) => {
      const stream = cloudinary.uploader.upload_stream({
        resource_type: 'auto',
        public_id: data.filename,
        folder: 'pizzahunt/products'
      });

      const bufferStream = new PassThrough();
      bufferStream.end(Buffer.from(data.fileData));
      bufferStream.pipe(stream);

      resolve(null);
    });
  }

  async delete(filename: string | undefined): Promise<void> {
    if (!filename) return;

    await cloudinary.uploader.destroy(filename);
  }

  getObjectURI(): string {
    throw new Error('Method not implemented.');
  }
}
