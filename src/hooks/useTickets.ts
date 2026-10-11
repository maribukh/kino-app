"use client";

import { useEffect, useState } from "react";
import { ticketsApi } from "@/lib/api/tickets";
import { TicketOrder } from "@/types/ticket";

export const useTickets = (isAuthenticated: boolean) => {
  const [tickets, setTickets] = useState<TicketOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    let isCurrentRequest = true;

    const loadTickets = async () => {
      setError(null);
      try {
        const result = await ticketsApi.getMyTickets();
        if (isCurrentRequest) setTickets(result);
      } catch (requestError: unknown) {
        if (isCurrentRequest) {
          const message =
            typeof requestError === "object" &&
            requestError !== null &&
            "message" in requestError &&
            typeof requestError.message === "string"
              ? requestError.message
              : "We could not load your tickets.";
          setError(
            requestError instanceof Error ? requestError.message : message,
          );
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    };

    loadTickets();
    return () => {
      isCurrentRequest = false;
    };
  }, [isAuthenticated, requestKey]);

  const retry = () => {
    setIsLoading(true);
    setRequestKey((currentKey) => currentKey + 1);
  };

  const updateTicket = (updatedTicket: TicketOrder) => {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket,
      ),
    );
  };

  return { tickets, isLoading, error, retry, updateTicket };
};
