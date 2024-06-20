import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { Prisma, SpotStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: createEventDto,
    });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  async findOne(id: string) {
    const event = await this.prismaService.event.findUnique({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    await this.findOne(id);

    return this.prismaService.event.update({
      data: updateEventDto,
      where: { id },
    });
  }

  remove(id: string) {
    return this.prismaService.event.delete({ where: { id } });
  }

  async reserveSpot(reserveSpotDto: ReserveSpotDto & { eventId: string }) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: reserveSpotDto.eventId,
        name: { in: reserveSpotDto.spots },
      },
    });
    if (spots.length !== reserveSpotDto.spots.length) {
      const foundSpotsName = spots.map((spot) => spot.name);
      const notFoundSpotsName = reserveSpotDto.spots.filter(
        (spotName) => !foundSpotsName.includes(spotName),
      );
      throw new NotFoundException(
        `Spots not found: ${notFoundSpotsName.join(', ')}`,
      );
    }

    try {
      const tickets = await this.prismaService.$transaction(
        async (prisma) => {
          await Promise.all([
            prisma.reservationHistory.deleteMany({
              where: {
                email: reserveSpotDto.email,
                spotId: { in: spots.map((spot) => spot.id) },
              },
            }),
            prisma.spot.updateMany({
              where: {
                id: { in: spots.map((spot) => spot.id) },
              },
              data: {
                status: SpotStatus.AVAILABLE,
              },
            }),
          ]);

          return Promise.all(
            spots.map((spot) =>
              prisma.ticket.create({
                data: {
                  spotId: spot.id,
                  ticketKind: reserveSpotDto.ticket_kind,
                  email: reserveSpotDto.email,
                },
              }),
            ),
          );
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );

      return tickets;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
          case 'P2034':
            throw new BadRequestException('Some spot are already reserved');
        }
      }

      throw error;
    }
  }
}
