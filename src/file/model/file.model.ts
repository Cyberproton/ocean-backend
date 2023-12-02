export class FileModel {
  id: string;
  name: string;
  mimetype?: string | null;
  path: string;
  size: number;
  sizeUnit: string;
  createdBy: number;
  createdAt?: Date | null;
}
