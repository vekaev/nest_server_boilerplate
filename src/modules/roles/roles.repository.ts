import { Injectable, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { Role } from './entities/role.entity';
import { RoleEnum } from './roles.enum';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from '@modules/db/error.constants';

const roles = Object.keys(RoleEnum)
  .map((name) => {
    return {
      name,
      id: RoleEnum[name as keyof typeof RoleEnum],
    };
  })
  .splice(2);

@Injectable()
@EntityRepository(Role)
export class RolesRepository extends Repository<Role> {
  private readonly logger = new Logger();

  async init(): Promise<void> {
    await Promise.allSettled(
      roles.map(async ({ id, name }) => {
        try {
          const created = new Role();
          created.id = id;
          created.name = name;
          await created.save();
        } catch (e) {
          if (e.code !== PG_UNIQUE_CONSTRAINT_VIOLATION) {
            this.logger.error(
              `not unique violation error while creating roles ${e}, shutdown`,
            );
            process.exit();
          }
        }
      }),
    );
    this.logger.log('roles initiated');
  }
}
