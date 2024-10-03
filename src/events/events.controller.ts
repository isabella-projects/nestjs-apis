import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpCode,
    Logger,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateEventDTO, UpdateEventDTO } from './input/events.dto';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';
import { CurrentUser } from './../auth/current-user.decorator';
import { User } from './../auth/user.entity';
import { AuthGuardJwt } from './../auth/auth-guard.jwt';

@Controller('/events')
@SerializeOptions({
    strategy: 'excludeAll',
})
export class EventsController {
    private readonly logger = new Logger(EventsController.name);

    constructor(private readonly eventsService: EventsService) {}

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Query() filter: ListEvents) {
        const events =
            await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
                filter,
                {
                    total: true,
                    currentPage: filter.page,
                    limit: 2,
                },
            );
        return events;
    }

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const event = await this.eventsService.getEventWithAttendeeCount(id);

        if (!event) {
            throw new NotFoundException();
        }

        return event;
    }

    @Post()
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async create(@Body() input: CreateEventDTO, @CurrentUser() user: User) {
        return await this.eventsService.createEvent(input, user);
    }

    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() input: UpdateEventDTO,
        @CurrentUser() user: User,
    ) {
        const event = await this.eventsService.findOne(id);

        if (!event) {
            throw new NotFoundException();
        }

        if (event.organizerId !== user.id) {
            throw new ForbiddenException(
                null,
                `You are not authorized to change this event`,
            );
        }

        return await this.eventsService.updateEvent(event, input);
    }

    @Delete(':id')
    @UseGuards(AuthGuardJwt)
    @HttpCode(204)
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ) {
        const event = await this.eventsService.findOne(id);

        if (!event) {
            throw new NotFoundException();
        }

        if (event.organizerId !== user.id) {
            throw new ForbiddenException(
                null,
                `You are not authorized to remove this event`,
            );
        }

        await this.eventsService.deleteEvent(id);
    }

    /*
    @Get('/practice')
    async practice() {
        // return await this.repository.find({
        //     select: ['id', 'when'],
        //     where: [
        //         {
        //             id: MoreThan(3),
        //             when: MoreThan(new Date('2021-02-12T13:00:00')),
        //         },
        //         {
        //             description: Like('%meet%'),
        //         },
        //     ],
        //     take: 2,
        //     order: {
        //         id: 'DESC',
        //     },
        // });
    }

    @Get('practice2')
    async practice2() {
        // return await this.repository.findOne({
        //     where: {
        //         id: 1,
        //     },
        //     loadEagerRelations: false,
        // });
        // const event = new Event();
        // event.id = 1;

        // const attendee = new Attendee();
        // attendee.name = 'Jerry The Second';
        // attendee.event = event;

        // await this.attendeeRepository.save(attendee);

        // return event;
    }
    */
}
