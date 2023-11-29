import { Prisma } from '@prisma/client';
import { UniqueConstraintException } from '../exception';

export class AbstractRepository<T> {
  protected returnOrThrow<T>(func: () => T): T {
    try {
      return func();
    } catch (error) {
      throw this.getError(error);
    }
  }

  protected getError(error: unknown): unknown {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return new UniqueConstraintException(error.meta!.target as string);
        default:
          return error;
      }
    }
    return error;
  }
}
