import { apiClient } from "./client";
import { TicketOrder, TicketsApiResponse } from "@/types/ticket";

export const ticketsApi = {
  getMyTickets: async (): Promise<TicketOrder[]> => {
    const response = await apiClient<TicketsApiResponse>("/tickets");
    return response.data;
  },
};