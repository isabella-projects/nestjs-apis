import { IsEnum } from 'class-validator';
import { AttendeeAnswerEnum } from '../attendee.entity';

export class CreateAttendeeDTO {
    @IsEnum(AttendeeAnswerEnum)
    answer: AttendeeAnswerEnum;
}
