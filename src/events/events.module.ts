import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsController } from './events.controller';
import { Event } from './events.entity';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { AttendeeService } from './attendee.service';

@Module({
    imports: [TypeOrmModule.forFeature([Event, Attendee])],
    controllers: [EventsController],
    providers: [EventsService, AttendeeService],
})
export class EventsModule {}
