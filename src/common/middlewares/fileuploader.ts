import { BadRequestError } from '@common/errors';
import fileUpload from 'express-fileupload';

export default function fileUploader() {
  return fileUpload({
    limits: {
      fileSize: 500 * 1024 // 500kb
    },
    abortOnLimit: true,
    limitHandler: (_req, _res, next) =>
      next(new BadRequestError('image is too large'))
  });
}
