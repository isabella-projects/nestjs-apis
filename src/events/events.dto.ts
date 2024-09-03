import { PartialType } from '@nestjs/mapped-types';

export class CreateEventDTO {
    name: string;
    description: string;
    when: string;
    address: string;
}

export class UpdateEventDTO extends PartialType(CreateEventDTO) {}
