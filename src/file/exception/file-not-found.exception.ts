import { BaseApiException } from 'src/common/exception';

export class FileNotFoundException extends BaseApiException {
  constructor() {
    super({ message: 'File not found', status: 404 });
  }
}
