import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { Transform } from 'class-transformer';

import { IsExist } from '@utils/validators';

export class AuthLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @Validate(IsExist, ['User'], {
    message: 'emailNotExists',
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
