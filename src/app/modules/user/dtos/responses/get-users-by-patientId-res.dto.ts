import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject } from 'class-validator';

export class GetUsersByPatientIdResDto {
  @ApiProperty()
  @IsNotEmptyObject({ nullable: false })
    user: Array<{
    name: string;
    email: string;
    phone: string;
    patientId: number;
  }>;
}