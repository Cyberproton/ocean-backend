import { Expose } from 'class-transformer';

export class FileOutputDto {
  constructor(partial: Partial<FileOutputDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  mimetype?: string | null;

  @Expose()
  size: number;

  @Expose()
  sizeUnit: string;

  @Expose()
  createdBy?: number | null;
}
