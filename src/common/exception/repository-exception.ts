export class RepositoryException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UniqueConstraintException extends RepositoryException {
  constructor(readonly target: string) {
    super(`Unique constraint violation on the ${target}`);
  }
}
