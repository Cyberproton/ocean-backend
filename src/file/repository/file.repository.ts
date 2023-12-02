import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/repository';
import { PrismaService } from 'src/prisma/service';
import { CreateFileDto } from '../dto';
import { FileModel } from '../model';
import { FileQuery } from './query';

@Injectable()
export class FileRepository extends AbstractRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(query: FileQuery): Promise<FileModel[]> {
    return this.returnOrThrow(() =>
      this.prisma.file.findMany({
        where: {
          id: {
            in: query.id,
          },
        },
        take: query.limit,
        skip: query.offset,
      }),
    );
  }

  async findById(id: string): Promise<FileModel | null> {
    return this.returnOrThrow(() =>
      this.prisma.file.findUnique({
        where: {
          id: id,
        },
      }),
    );
  }

  async create(input: CreateFileDto): Promise<FileModel> {
    return this.returnOrThrow(() => this.prisma.file.create({ data: input }));
  }
}
