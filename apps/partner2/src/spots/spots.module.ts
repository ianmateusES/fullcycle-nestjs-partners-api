import { Module } from '@nestjs/common';
import { SpotsController } from './spots.controller';
import { SpotsCoreModule } from '@app/core';

@Module({
  imports: [SpotsCoreModule],
  controllers: [SpotsController],
})
export class SpotsModule {}
