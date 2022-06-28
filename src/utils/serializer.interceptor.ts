import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import userResponseSerializer from '@modules/users/user-response.serializer';
import { User } from '@modules/users';
import deepMapObject from './deep-map-object';

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        return deepMapObject(data, (value: { __entity: string }) => {
          if (value.__entity === 'User') {
            userResponseSerializer(value as User);
          }

          return value;
        });
      }),
    );
  }
}
