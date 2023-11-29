import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/repository';
import { PrismaService } from 'src/prisma/service';
import { RoleModel } from '../model';

@Injectable()
export class RoleRepository extends AbstractRepository<RoleModel> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(): Promise<RoleModel[]> {
    return this.prisma.role.findMany();
  }

  async findById(id: string): Promise<RoleModel | null> {
    return this.returnOrThrow(() =>
      this.prisma.role.findUnique({
        where: {
          id,
        },
      }),
    );
  }

  async findByUserId(userId: number): Promise<RoleModel[]> {
    return this.returnOrThrow(() =>
      this.prisma.role.findMany({
        where: {
          UserRole: {
            some: {
              userId,
            },
          },
        },
      }),
    );
  }
}
