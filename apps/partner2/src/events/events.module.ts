import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsCoreModule } from '@app/core';

@Module({
  imports: [EventsCoreModule],
  controllers: [EventsController],
})
export class EventsModule {}
