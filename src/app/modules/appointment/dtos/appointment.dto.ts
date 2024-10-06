import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsDateString, Matches } from 'class-validator';

export class AppointmentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    crp: string;

    @ApiProperty()
    @IsNotEmpty()
    patientId: string;
  
    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    date: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{2}:\d{2}$/, { message: 'Start time must be in the format HH:mm' })
    startTime: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{2}:\d{2}$/, { message: 'End time must be in the format HH:mm' })
    endTime: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    location: string;
}