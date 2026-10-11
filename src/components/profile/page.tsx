"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { MyTickets } from "@/components/profile/MyTickets";
import { useTickets } from "@/hooks/useTickets";

export default function ProfilePage() {
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "tickets">("info");
  const { tickets, isLoading, error, retry } = useTickets(isAuthenticated);
  const ticketCount = tickets
    .filter((order) => order.status !== "refunded")
    .reduce((total, order) => total + order.tickets.length, 0);

  return (
    <section className="min-h-screen bg-bg-page text-white pt-28 pb-16 px-4 sm:px-8 md:px-16">
      <div className="max-w-4xl">
        <h1 className="text-[32px] font-bold mb-6">My Profile</h1>

        <div className="flex gap-8 border-b border-white/10 pb-4 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`text-[15px] font-medium transition-colors relative pb-4 -mb-4 ${
              activeTab === "info"
                ? "text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            Personal Information
            {activeTab === "info" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-color-red" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tickets")}
            className={`text-[15px] font-medium transition-colors relative pb-4 -mb-4 flex items-center gap-2 ${
              activeTab === "tickets"
                ? "text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            My Tickets
            {ticketCount > 0 && (
              <span className="bg-color-red text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                {ticketCount}
              </span>
            )}
            {activeTab === "tickets" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-color-red" />
            )}
          </button>
        </div>

        {activeTab === "info" && <PersonalInfoForm user={user} />}
        {activeTab === "tickets" &&
          (isAuthenticated ? (
            <MyTickets
              tickets={tickets}
              isLoading={isLoading}
              error={error}
              onRetry={retry}
            />
          ) : (
            <div className="max-w-5xl border border-white/10 rounded-2xl px-6 py-12 text-center">
              <h2 className="text-lg font-semibold text-white">
                Log in to view your tickets
              </h2>
              <p className="mt-2 text-sm text-white/50">
                Tickets purchased with your account will appear here.
              </p>
              <button
                type="button"
                onClick={openLoginModal}
                className="mt-5 text-sm font-semibold text-color-red hover:text-white"
              >
                Log in
              </button>
            </div>
          ))}
      </div>
    </section>
  );
}
