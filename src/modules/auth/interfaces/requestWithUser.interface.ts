import { Request } from 'express';
import { User } from '@modules/users';

export interface RequestWithUser extends Request {
  user: User;
}
