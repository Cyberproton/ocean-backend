import { Prisma } from '@prisma/client';
import { UniqueConstraintException } from '../exception';
import { requireNonNull } from '../util';

export class AbstractRepository {
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
          return new UniqueConstraintException(
            requireNonNull(error.meta).target as string,
          );
        default:
          return error;
      }
    }
    return error;
  }
}
