import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { SpotsModule } from './spots/spots.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@app/core/prisma/prisma.module';
import { AuthGuard } from '@app/core/auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.partner1', isGlobal: true }),
    PrismaModule,
    AuthGuard,
    EventsModule,
    SpotsModule,
  ],
})
export class Partner1Module {}
