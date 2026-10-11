"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTickets } from "@/hooks/useTickets";
import { MyTickets } from "@/components/profile/MyTickets";

export const TicketsPage = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const { tickets, isLoading, error, retry, updateTicket } =
    useTickets(isAuthenticated);

  return (
    <section className="min-h-screen bg-bg-page px-4 pb-20 pt-32 text-white sm:px-8 md:px-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/profile"
          className="text-xs text-white/45 hover:text-white"
        >
          ← My profile
        </Link>
        <h1 className="mb-8 mt-3 text-3xl font-bold">My Tickets</h1>
        {isAuthenticated ? (
          <MyTickets
            tickets={tickets}
            isLoading={isLoading}
            error={error}
            onRetry={retry}
            onTicketUpdate={updateTicket}
          />
        ) : (
          <div className="rounded-2xl border border-white/10 px-6 py-12 text-center">
            <h2 className="text-lg font-semibold">
              Log in to view your tickets
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Purchased tickets are linked to your account.
            </p>
            <button
              type="button"
              onClick={openLoginModal}
              className="mt-5 text-sm font-semibold text-color-red hover:text-white"
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
