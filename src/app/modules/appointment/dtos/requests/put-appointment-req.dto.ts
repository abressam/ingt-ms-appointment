import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, Matches, IsNotEmpty } from 'class-validator';

export class PutAppointmentReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    uuid: string;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    date?: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    @Matches(/^\d{2}:\d{2}$/, { message: 'Start time must be in the format HH:mm' })
    startTime?: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    @Matches(/^\d{2}:\d{2}$/, { message: 'End time must be in the format HH:mm' })
    endTime?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    type?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    location?: string;
}