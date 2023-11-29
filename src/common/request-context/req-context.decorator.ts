import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { UserAccessTokenClaims } from 'src/auth/dto';
import {
  FORWARDED_FOR_TOKEN_HEADER,
  REQUEST_ID_TOKEN_HEADER,
} from '../constant';
import { RequestContext } from './request-context.dto';

export const ReqContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    switch (ctx.getType()) {
      case 'http':
        const request = ctx.switchToHttp().getRequest();
        return createRequestContext(request);
      // case 'ws':
      //   const client = ctx.switchToWs().getClient();
      //   return createRequestContextFromWs(client);
      default:
        throw new Error('Unsupported context type');
    }
  },
);

// Creates a RequestContext object from Request
export function createRequestContext(request: Request): RequestContext {
  const ctx = new RequestContext();
  ctx.requestId = request.header(REQUEST_ID_TOKEN_HEADER) || '';
  ctx.url = request.url;
  const ip = request.header(FORWARDED_FOR_TOKEN_HEADER);
  ctx.ip = ip ? ip : request.ip;

  // If request.user does not exist, we explicitly set it to null.
  ctx.user = request.user
    ? plainToClass(UserAccessTokenClaims, request.user, {
        excludeExtraneousValues: true,
      })
    : new UserAccessTokenClaims();

  return ctx;
}

// export const createRequestContextFromWs = (client: Socket): RequestContext => {
//   const ctx = new RequestContext();
//   ctx.requestId =
//     (client.handshake.headers[REQUEST_ID_TOKEN_HEADER] as string) || '';
//   ctx.url = client.handshake.url;
//   ctx.ip = client.handshake.address;

//   const user = (client.handshake as any).user;
//   // If request.user does not exist, we explicitly set it to null.
//   ctx.account = user
//     ? plainToClass(AccountAccessTokenClaims, user, {
//         excludeExtraneousValues: true,
//       })
//     : new AccountAccessTokenClaims();

//   return ctx;
// };
