import { IFileData, IFileStorage, IUploadedImage } from '@common/types';
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

  // async upload(data: IFileData): Promise<IUploadedImage> {
  //   await cloudinary.uploader.upload(
  //     `data:image/jpeg;base64,${Buffer.from(data.fileData).toString('base64')}`,
  //     {
  //       resource_type: 'auto',
  //       public_id: data.filename,
  //       folder: 'pizzahunt/products'
  //     }
  //   );

  //   const imageId = data.filename;
  //   const url = this.getObjectURI(`${data.folder}/${imageId}`);

  //   return Promise.resolve({ imageId, url });
  // }

  async upload(data: IFileData): Promise<IUploadedImage> {
    const folder = data.folder ? `/${data.folder}` : '';

    const stream = cloudinary.uploader.upload_stream({
      resource_type: 'image',
      public_id: data.filename,
      folder: `pizzahunt${folder}`
    });

    const bufferStream = new PassThrough();
    bufferStream.end(Buffer.from(data.fileData));
    bufferStream.pipe(stream);

    const imageId = data.filename;
    const url = this.getObjectURI(imageId, data.folder);

    return Promise.resolve({ imageId, url });
  }

  async delete(filename: string | undefined): Promise<void> {
    if (!filename) return;

    await cloudinary.uploader.destroy(`pizzahunt/${filename}`, {
      resource_type: 'image'
    });
  }

  getObjectURI(filename: string, folder?: string): string {
    const public_id = `pizzahunt/${folder ? `${folder}/` : ''}${filename}`;

    return cloudinary.url(public_id);
  }
}
