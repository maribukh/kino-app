"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { TicketOrder } from "@/types/ticket";
import { ticketsApi } from "@/lib/api/tickets";

interface MyTicketsProps {
  tickets: TicketOrder[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onTicketUpdate: (ticket: TicketOrder) => void;
}

type TicketPeriod = "upcoming" | "past";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GEL",
    maximumFractionDigits: 2,
  }).format(price);

const getStatusLabel = (status: string) => {
  if (status === "refunded") return "Refunded";
  if (status === "paid" || status === "completed") return "Paid";
  return status.replaceAll("_", " ");
};

export const MyTickets = ({
  tickets,
  isLoading,
  error,
  onRetry,
  onTicketUpdate,
}: MyTicketsProps) => {
  const [period, setPeriod] = useState<TicketPeriod>("upcoming");
  const [refundingId, setRefundingId] = useState<number | null>(null);
  const [refundError, setRefundError] = useState<string | null>(null);
  const upcomingTickets = tickets.filter((order) => order.isUpcoming);
  const pastTickets = tickets.filter((order) => !order.isUpcoming);
  const visibleTickets = period === "upcoming" ? upcomingTickets : pastTickets;

  const refundOrder = async (order: TicketOrder) => {
    if (
      !order.isRefundable ||
      !window.confirm(`Refund booking ${order.reference}?`)
    ) {
      return;
    }
    setRefundingId(order.id);
    setRefundError(null);
    try {
      const updatedTicket = await ticketsApi.refundOrder(order.reference);
      onTicketUpdate(updatedTicket);
    } catch (requestError: unknown) {
      const message =
        typeof requestError === "object" &&
        requestError !== null &&
        "message" in requestError &&
        typeof requestError.message === "string"
          ? requestError.message
          : "We could not refund this booking.";
      setRefundError(message);
    } finally {
      setRefundingId(null);
    }
  };

  return (
    <section aria-label="My tickets" className="max-w-5xl">
      <div className="flex items-center gap-8 border-b border-white/10 mb-6">
        {(
          [
            ["upcoming", "Upcoming", upcomingTickets.length],
            ["past", "Past", pastTickets.length],
          ] as const
        ).map(([value, label, count]) => (
          <button
            key={value}
            type="button"
            aria-pressed={period === value}
            onClick={() => setPeriod(value)}
            className={`relative flex items-center gap-2 pb-4 text-[14px] font-medium transition-colors ${
              period === value ? "text-white" : "text-white/50 hover:text-white"
            }`}
          >
            {label}
            <span className="text-[12px] text-white/40">{count}</span>
            {period === value && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-color-red" />
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4" aria-label="Loading tickets">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-2xl border border-white/10 bg-white/3"
            />
          ))}
        </div>
      ) : error ? (
        <div className="border border-color-red/30 bg-tint-red p-5 rounded-xl">
          <p className="text-sm text-white">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 text-sm font-semibold text-color-red hover:text-white"
          >
            Try again
          </button>
        </div>
      ) : visibleTickets.length === 0 ? (
        <div className="border border-white/10 rounded-2xl px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-white">
            {period === "upcoming" ? "No upcoming tickets" : "No past tickets"}
          </h2>
          <p className="mt-2 text-sm text-white/50">
            {period === "upcoming"
              ? "Your booked sessions will appear here."
              : "Completed sessions will appear here."}
          </p>
          {period === "upcoming" && (
            <Link
              href="/sessions"
              className="inline-flex mt-5 text-sm font-semibold text-color-red hover:text-white"
            >
              Browse sessions
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {refundError && (
            <p
              role="alert"
              className="rounded-xl border border-color-red/30 bg-tint-red p-4 text-sm text-color-red"
            >
              {refundError}
            </p>
          )}
          {visibleTickets.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3 text-[12px]">
                <span className="text-white/50">
                  Booking reference{" "}
                  <span className="text-white">{order.reference}</span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 font-semibold capitalize ${
                    order.status === "refunded"
                      ? "bg-white/10 text-white/60"
                      : "bg-tint-green text-color-green"
                  }`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-[88px_minmax(0,1fr)]">
                <Link
                  href={`/movies/${order.session.movie.slug}`}
                  aria-label={`View ${order.session.movie.title}`}
                  className="relative aspect-2/3 w-22 overflow-hidden rounded-lg bg-bg-card"
                >
                  <Image
                    src={order.session.movie.posterUrl}
                    alt=""
                    fill
                    sizes="88px"
                    className="object-cover"
                  />
                </Link>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/movies/${order.session.movie.slug}`}
                        className="text-lg font-bold text-white hover:text-color-red"
                      >
                        {order.session.movie.title}
                      </Link>
                      <p className="mt-1 text-[12px] text-white/50">
                        {order.session.movie.ageRating.code}
                        {order.session.movie.runtimeMinutes > 0 &&
                          ` · ${order.session.movie.runtimeMinutes} min`}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-semibold text-white">
                        {formatDate(order.session.startsAt)}
                      </p>
                      <p className="mt-1 text-sm text-color-red">
                        {order.session.time}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-[13px] text-white/65">
                    {order.session.venue.name}, {order.session.venue.city}
                    <span className="px-2 text-white/25">|</span>
                    Hall {order.session.hall.name}
                  </p>
                  <p className="mt-1 text-[12px] text-white/45">
                    {order.session.format.name} · {order.session.language.name}
                  </p>

                  <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4">
                    <div>
                      <p className="mb-2 text-[11px] uppercase text-white/40">
                        Seats · {order.tickets.length}{" "}
                        {order.tickets.length === 1 ? "ticket" : "tickets"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.tickets.map((ticket) => (
                          <span
                            key={ticket.id}
                            className="rounded-md border border-white/15 px-2.5 py-1 text-[12px] text-white"
                          >
                            {ticket.seatCode}
                            <span className="ml-1.5 text-white/45">
                              {ticket.ticketType.name}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      Total{" "}
                      <span className="ml-2">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </p>
                  </div>
                  {period === "upcoming" && (
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        title={
                          order.isRefundable
                            ? "Refund this booking"
                            : "Refunds close 2 hours before the session"
                        }
                        disabled={
                          !order.isRefundable || refundingId === order.id
                        }
                        onClick={() => refundOrder(order)}
                        className="text-xs font-semibold text-color-red transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-white/25"
                      >
                        {refundingId === order.id
                          ? "Refunding..."
                          : "Refund booking"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
