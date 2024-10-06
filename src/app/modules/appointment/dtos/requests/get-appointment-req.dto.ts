import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class GetAppointmentReqDto {
    @ApiProperty({ required: false })
    @IsOptional()
    patientId?: string;
  
    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    endDate?: string;
}