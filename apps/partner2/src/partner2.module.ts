import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@app/core/auth/auth.module';
import { PrismaModule } from '@app/core/prisma/prisma.module';
import { AuthGuard } from '@app/core/auth/auth.guard';
import { EventsModule } from './events/events.module';
import { SpotsModule } from './spots/spots.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.partner2', isGlobal: true }),
    AuthModule,
    PrismaModule,
    AuthGuard,
    EventsModule,
    SpotsModule,
  ],
})
export class Partner2Module {}
