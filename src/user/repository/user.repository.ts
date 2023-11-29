import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/repository';
import { PrismaService } from 'src/prisma/service';
import { CreateUserDto } from '../dto';
import { User } from '../model';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: number): Promise<User | null> {
    return this.returnOrThrow(() =>
      this.prisma.user.findUnique({
        where: {
          id,
        },
      }),
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.returnOrThrow(() =>
      this.prisma.user.findUnique({
        where: {
          username: username,
        },
      }),
    );
  }

  async create(dto: CreateUserDto): Promise<User> {
    return this.returnOrThrow(() =>
      this.prisma.user.create({
        data: dto,
      }),
    );
  }
}
