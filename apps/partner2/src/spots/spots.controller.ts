import { SpotsService } from '@app/core';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { CreateSpotRequest } from './request/create-spot.request';
import { UpdateSpotRequest } from './request/update-spot.request';

@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(
    @Param('eventId') eventId: string,
    @Body() createSpotRequest: CreateSpotRequest,
  ) {
    return this.spotsService.create({ ...createSpotRequest, eventId });
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId);
  }

  @Get(':id')
  findOne(@Param('eventId') eventId: string, @Param('id') id: string) {
    return this.spotsService.findOne(id, eventId);
  }

  @Patch(':id')
  update(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Body() updateSpotRequest: UpdateSpotRequest,
  ) {
    return this.spotsService.update(id, eventId, updateSpotRequest);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('eventId') eventId: string, @Param('id') id: string) {
    return this.spotsService.remove(id, eventId);
  }
}
