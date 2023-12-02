import { Expose } from 'class-transformer';

export class UploadFileOutputDto {
  constructor(partial: Partial<UploadFileOutputDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  mimetype?: string | null;
}
