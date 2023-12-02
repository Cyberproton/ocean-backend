import { BaseApiException } from 'src/common/exception';
import { toHumanFileSize } from 'src/common/util';

export class FileTooLargeException extends BaseApiException {
  constructor(fileSize: number, maxFileSize: string) {
    super({
      message: `Max allowed file size is ${maxFileSize}, current file size is ${toHumanFileSize(
        fileSize,
      )}`,
    });
  }
}
