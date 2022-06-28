import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength, Validate } from 'class-validator';

import { Role } from '@modules/roles/entities/role.entity';
import { Status } from '@modules/statuses/entities/status.entity';
import { IsNotExist, IsExist } from '@utils/validators';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsOptional()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email?: string | null;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string | null;

  // @ApiProperty({ type: () => FileEntity })
  // @IsOptional()
  // @Validate(IsExist, ['FileEntity', 'id'], {
  //   message: 'imageNotExists',
  // })
  // photo?: FileEntity | null;

  @ApiProperty({ type: Role })
  @IsOptional()
  @Validate(IsExist, ['Role', 'id'], {
    message: 'roleNotExists',
  })
  role?: Role | null;

  @ApiProperty({ type: Status })
  @IsOptional()
  @Validate(IsExist, ['Status', 'id'], {
    message: 'statusNotExists',
  })
  status?: Status;

  hash?: string | null;
}
