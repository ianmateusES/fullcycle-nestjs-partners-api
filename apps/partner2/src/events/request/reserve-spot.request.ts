import { TicketKind } from '@prisma/client';

export class ReserveSpotRequest {
  spots: string[];
  ticket_kind: TicketKind;
  email: string;
}
