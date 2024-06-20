import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { SpotStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpotsService {
  constructor(private prismaService: PrismaService) {}

  async create(createSpotDto: CreateSpotDto & { eventId: string }) {
    const event = await this.prismaService.event.findUnique({
      where: { id: createSpotDto.eventId },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prismaService.spot.create({
      data: {
        ...createSpotDto,
        status: SpotStatus.AVAILABLE,
      },
    });
  }

  findAll(eventId: string) {
    return this.prismaService.spot.findMany({
      where: { eventId },
    });
  }

  async findOne(id: string, eventId: string) {
    const spot = await this.prismaService.spot.findUnique({
      where: { id, eventId },
    });
    if (!spot) {
      throw new NotFoundException('Spot not found');
    }

    return spot;
  }

  async update(id: string, eventId: string, updateSpotDto: UpdateSpotDto) {
    await this.findOne(id, eventId);

    return this.prismaService.spot.update({
      where: { id, eventId },
      data: updateSpotDto,
    });
  }

  remove(id: string, eventId: string) {
    return this.prismaService.spot.delete({
      where: { id, eventId },
    });
  }
}
