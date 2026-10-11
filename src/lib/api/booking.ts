import { apiClient } from "./client";
import {
  CreateOrderInput,
  CreateOrderResponse,
  SeatHoldResponse,
  SeatMapResponse,
} from "@/types/booking";
import { Screening } from "@/types/sessions";

interface SessionResponse {
  data: Screening;
}

export interface HoldSeatInput {
  seatId: number;
  ticketType: string;
}

export const bookingApi = {
  getSession: async (sessionId: number) =>
    apiClient<SessionResponse>(`/sessions/${sessionId}`),

  getSeatMap: async (sessionId: number) =>
    apiClient<SeatMapResponse>(`/sessions/${sessionId}/seats`),

  createHold: async (sessionId: number, seats: HoldSeatInput[]) =>
    apiClient<SeatHoldResponse>(`/sessions/${sessionId}/holds`, {
      method: "POST",
      body: JSON.stringify({ seats }),
    }),

  createOrder: async (input: CreateOrderInput) =>
    apiClient<CreateOrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  releaseHold: async (holdId: string) =>
    apiClient(`/holds/${holdId}`, { method: "DELETE" }),
};
