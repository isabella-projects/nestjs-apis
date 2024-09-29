import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Put,
    Query,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { AttendeeService } from './attendee.service';
import { CreateAttendeeDTO } from './input/create-attendee.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';

@Controller('events-attendance')
@SerializeOptions({
    strategy: 'excludeAll',
})
export class CurrentUserEventAttendanceController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly attendeeService: AttendeeService,
    ) {}

    @Get()
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    public async findAll(@CurrentUser() user: User, @Query('page') page = 1) {
        return await this.eventsService.getEventsAttendedByUserIdPaginated(
            user.id,
            {
                currentPage: page,
                limit: 6,
            },
        );
    }

    @Get(':/eventId')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    public async findOne(
        @Param('eventId', ParseIntPipe) eventId: number,
        @CurrentUser() user: User,
    ) {
        const attendee = await this.attendeeService.findOneByEventIdAndUserId(
            eventId,
            user.id,
        );

        if (!attendee) {
            throw new NotFoundException();
        }

        return attendee;
    }

    @Put('/:eventId')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    public async createOrUpdate(
        @Param('eventId', ParseIntPipe) eventId: number,
        @Body() input: CreateAttendeeDTO,
        @CurrentUser() user: User,
    ) {
        return await this.attendeeService.createOrUpdate(
            input,
            eventId,
            user.id,
        );
    }
}
