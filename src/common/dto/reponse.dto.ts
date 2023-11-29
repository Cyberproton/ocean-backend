export class BaseApiResponse<T> {
  public data: T; // Swagger Decorator is added in the extended class below, since that will override this one.

  public meta?: any = {};
}
