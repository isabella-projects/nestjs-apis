import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDTO {
    @IsString()
    @Length(5, 255, {
        message: 'The name length is wrong!',
    })
    name: string;

    @Length(5, 255)
    description: string;

    @IsDateString()
    when: string;

    @Length(5, 255)
    address: string;
}

export class UpdateEventDTO extends PartialType(CreateEventDTO) {}
