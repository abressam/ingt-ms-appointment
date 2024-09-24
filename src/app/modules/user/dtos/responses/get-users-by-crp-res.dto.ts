import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject } from 'class-validator';

export class GetUsersByCrpResDto {
  @ApiProperty()
  @IsNotEmptyObject({ nullable: false })
    user: Array<{
    name: string;
    email: string;
    phone: string;
    crp: string;
  }>;
}