export interface PurchasedTicket {
  id: number;
  seatCode: string;
  ticketType: {
    slug: string;
    name: string;
  };
  price: number;
}

export interface TicketOrder {
  id: number;
  reference: string;
  status: string;
  totalPrice: number;
  paidAt: string | null;
  refundedAt?: string | null;
  isUpcoming: boolean;
  isRefundable: boolean;
  session: {
    id: number;
    startsAt: string;
    date: string;
    time: string;
    hall: {
      id: number;
      name: string;
    };
    venue: {
      id: number;
      name: string;
      city: string;
    };
    format: {
      name: string;
    };
    language: {
      name: string;
    };
    movie: {
      id: number;
      slug: string;
      title: string;
      posterUrl: string;
      runtimeMinutes: number;
      ageRating: {
        code: string;
      };
    };
  };
  tickets: PurchasedTicket[];
}

export interface TicketsApiResponse {
  data: TicketOrder[];
}
