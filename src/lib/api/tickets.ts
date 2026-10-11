import { apiClient } from "./client";
import { TicketOrder, TicketsApiResponse } from "@/types/ticket";

interface TicketOrderResponse {
  data: TicketOrder;
}

export const ticketsApi = {
  getMyTickets: async (): Promise<TicketOrder[]> => {
    const response = await apiClient<TicketsApiResponse>("/tickets");
    return response.data;
  },

  refundOrder: async (reference: string): Promise<TicketOrder> => {
    const response = await apiClient<TicketOrderResponse>(
      `/orders/${reference}/refund`,
      { method: "POST", body: JSON.stringify({}) },
    );
    return response.data;
  },
};
