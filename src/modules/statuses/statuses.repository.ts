import { Injectable, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { PG_UNIQUE_CONSTRAINT_VIOLATION } from '@modules/db/error.constants';
import { Status } from './entities/status.entity';
import { StatusEnum } from './statuses.enum';

const roles = Object.keys(StatusEnum)
  .map((name) => {
    return {
      name,
      id: StatusEnum[name as keyof typeof StatusEnum],
    };
  })
  .splice(2);

@Injectable()
@EntityRepository(Status)
export class StatusRepository extends Repository<Status> {
  private readonly logger = new Logger();

  async init(): Promise<void> {
    await Promise.allSettled(
      roles.map(async ({ id, name }) => {
        try {
          const created = new Status();
          created.id = id;
          created.name = name;
          await created.save();
        } catch (e) {
          if (e.code !== PG_UNIQUE_CONSTRAINT_VIOLATION) {
            this.logger.error(
              `not unique violation error while creating statuses ${e}, shutdown`,
            );
            process.exit();
          }
        }
      }),
    );
    this.logger.log('statuses initiated');
  }
}
