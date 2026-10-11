import { Screening } from "@/types/sessions";
import { TicketOrder } from "@/types/ticket";

export interface Seat {
  id: number;
  code: string;
  label: string;
  state: "available" | "unavailable" | "held" | "sold" | string;
  aisleAfter: boolean;
  isMine: boolean;
}

export interface SeatMapSection {
  name: string;
  rows: {
    label: string;
    seats: Seat[];
  }[];
}

export interface SeatMap {
  sessionId: number;
  hall: Screening["hall"];
  sections: SeatMapSection[];
}

export interface SeatMapResponse {
  data: SeatMap;
}

export interface SeatHold {
  holdId: string;
  sessionId: number;
  expiresAt: string;
  secondsRemaining: number;
  isLive: boolean;
  subtotal: number;
}

export interface SeatHoldResponse {
  data: SeatHold;
}

export interface CreateOrderInput {
  holdId: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface CreateOrderResponse {
  data: TicketOrder;
}
