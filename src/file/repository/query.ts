import { PaginationQuery } from 'src/common/repository/query';

export class FileQuery extends PaginationQuery {
  id?: string[];

  createdBy?: number;
}
