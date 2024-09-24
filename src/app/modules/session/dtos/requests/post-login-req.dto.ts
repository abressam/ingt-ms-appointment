import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, ValidateIf } from 'class-validator';

export class PostLoginReqDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    @ValidateIf(val => !val.crp)
    @IsNotEmpty({ message: 'Email is required if CRP is not provided' })
    email: string;

    @ApiProperty()
    @IsString()
    @ValidateIf(val => !val.email)
    @IsNotEmpty({ message: 'CRP is required if Email is not provided' })
    crp: string | null;
    
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    password: string;
}