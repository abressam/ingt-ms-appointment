import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject } from 'class-validator';
import { AppointmentDto } from '@app/modules/appointment/dtos/appointment.dto';

export class GetAppointmentResDto {
  @ApiProperty()
  @IsNotEmptyObject({ nullable: false })
  appointment: AppointmentDto[];
}