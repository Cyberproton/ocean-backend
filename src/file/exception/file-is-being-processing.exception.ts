import { BaseApiException } from 'src/common/exception';

export class FileProcessingHasNotFinished extends BaseApiException {
  constructor() {
    super({ message: 'File is being processed' });
  }
}
