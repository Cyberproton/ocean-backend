export class CreateFileDto {
  id: string;

  name: string;

  mimetype?: string;

  path: string;

  size: number;

  sizeUnit: string;

  createdBy?: number;
}
