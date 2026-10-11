"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useConfig } from "@/context/ConfigContext";
import { bookingApi, HoldSeatInput } from "@/lib/api/booking";
import { CreateOrderInput, Seat, SeatHold, SeatMap } from "@/types/booking";
import { Screening } from "@/types/sessions";
import { TicketOrder } from "@/types/ticket";

interface BookingPageProps {
  sessionId: number;
}

interface SelectedSeat {
  seat: Seat;
  ticketType: string;
}

interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

const getApiError = (error: unknown): ApiError =>
  typeof error === "object" && error !== null ? (error as ApiError) : {};

const luhnIsValid = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 16) return false;
  let sum = 0;
  let doubleDigit = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
};

const secondsUntil = (expiresAt: string) =>
  Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));

const formatDate = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

export const BookingPage = ({ sessionId }: BookingPageProps) => {
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const { options } = useConfig();
  const [session, setSession] = useState<Screening | null>(null);
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<
    Record<number, SelectedSeat>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isHolding, setIsHolding] = useState(false);
  const [hold, setHold] = useState<SeatHold | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [order, setOrder] = useState<TicketOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"seats" | "checkout">("seats");
  const [contact, setContact] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      bookingApi.getSession(sessionId),
      bookingApi.getSeatMap(sessionId),
    ])
      .then(([sessionResult, seatsResult]) => {
        if (!active) return;
        setSession(sessionResult.data);
        setSeatMap(seatsResult.data);
      })
      .catch((requestError: unknown) => {
        if (active)
          setErrorMessage(
            getApiError(requestError).message || "Could not load the seat map.",
          );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [sessionId]);

  useEffect(() => {
    if (!hold) return;
    const timer = window.setInterval(() => {
      const remaining = secondsUntil(hold.expiresAt);
      setSecondsLeft(remaining);
      if (remaining === 0) {
        setHold(null);
        setSelectedSeats({});
        setStep("seats");
        setErrorMessage("Your hold time expired. Please re-select your seats.");
        bookingApi
          .getSeatMap(sessionId)
          .then((result) => setSeatMap(result.data))
          .catch(() => undefined);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [hold, sessionId]);

  const ticketTypes = options?.ticketTypes || [];
  const maxSeats = options?.maxSeatsPerOrder || 3;
  const activeHold = hold && secondsLeft > 0 ? hold : null;
  const selected = useMemo(() => Object.values(selectedSeats), [selectedSeats]);
  const total = selected.reduce((sum, selection) => {
    const ticketType = ticketTypes.find(
      (type) => type.slug === selection.ticketType,
    );
    return sum + (session?.price || 0) * (ticketType?.priceRatio || 1);
  }, 0);
  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const onToggleSeat = (seat: Seat) => {
    if (seat.state !== "available" || activeHold) return;
    setErrorMessage(null);
    if (selectedSeats[seat.id]) {
      setSelectedSeats((current) => {
        const next = { ...current };
        delete next[seat.id];
        return next;
      });
      return;
    }
    if (selected.length >= maxSeats) {
      setErrorMessage(`You can select up to ${maxSeats} seats per order.`);
      return;
    }
    setSelectedSeats((current) => ({
      ...current,
      [seat.id]: { seat, ticketType: ticketTypes[0]?.slug || "adult" },
    }));
  };

  const updateTicketType = (seatId: number, ticketType: string) => {
    setSelectedSeats((current) => ({
      ...current,
      [seatId]: { ...current[seatId], ticketType },
    }));
  };

  const beginHold = async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (!user?.profileComplete) {
      setErrorMessage("Complete your profile before booking.");
      return;
    }
    if (!selected.length) {
      setErrorMessage("Choose at least one seat.");
      return;
    }
    setIsHolding(true);
    setErrorMessage(null);
    setContact((current) => ({
      ...current,
      fullName: user?.fullName || current.fullName,
      email: user?.email || current.email,
      mobileNumber: user?.mobileNumber || current.mobileNumber,
    }));
    try {
      const seats: HoldSeatInput[] = selected.map(({ seat, ticketType }) => ({
        seatId: seat.id,
        ticketType,
      }));
      const result = await bookingApi.createHold(sessionId, seats);
      const createdHold = result.data;
      if (!createdHold.isLive)
        throw new Error("The seat hold is no longer active.");
      setHold(createdHold);
      setSecondsLeft(secondsUntil(createdHold.expiresAt));
      setFieldErrors({});
      setStep("checkout");
    } catch (requestError: unknown) {
      const apiError = getApiError(requestError);
      const message =
        apiError.message ||
        (requestError instanceof Error
          ? requestError.message
          : "Could not hold these seats.");
      setErrorMessage(message);
      if (message.toLowerCase().includes("seat")) {
        const freshMap = await bookingApi
          .getSeatMap(sessionId)
          .catch(() => null);
        if (freshMap) setSeatMap(freshMap.data);
      }
    } finally {
      setIsHolding(false);
    }
  };

  const validateCheckout = () => {
    const errors: Record<string, string> = {};
    if (contact.fullName.trim().length < 3)
      errors.fullName = "Enter at least 3 characters.";
    if (!/^\S+@\S+\.\S+$/.test(contact.email))
      errors.email = "Enter a valid email.";
    if (!/^5\d{8}$/.test(contact.mobileNumber.replace(/\D/g, "")))
      errors.mobileNumber =
        "Use a 9-digit Georgian mobile number starting with 5.";
    if (!luhnIsValid(contact.cardNumber))
      errors.cardNumber = "Enter a valid card number.";
    const expiry = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(contact.expiry);
    if (!expiry) {
      errors.expiry = "Use MM/YY format.";
    } else {
      const expiryYear = 2000 + Number(expiry[2]);
      const expiryMonth = Number(expiry[1]);
      const now = new Date();
      if (
        expiryYear < now.getFullYear() ||
        (expiryYear === now.getFullYear() && expiryMonth < now.getMonth() + 1)
      )
        errors.expiry = "This card has expired.";
    }
    if (!/^\d{3}$/.test(contact.cvv)) errors.cvv = "Enter a 3 digit CVV.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitOrder = async (
    event?: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (event) event.preventDefault();
    if (!hold || !validateCheckout()) return;
    setIsCheckingOut(true);
    setErrorMessage(null);
    try {
      const input: CreateOrderInput = {
        holdId: hold.holdId,
        ...contact,
        cardNumber: contact.cardNumber.replace(/\s/g, ""),
        expiry: contact.expiry,
      };
      const result = await bookingApi.createOrder(input);
      setOrder(result.data);
      setHold(null);
      setSecondsLeft(0);
    } catch (requestError: unknown) {
      const apiError = getApiError(requestError);
      if (apiError.errors) {
        const messages: Record<string, string> = {};
        Object.entries(apiError.errors).forEach(([key, values]) => {
          messages[key] = values[0];
        });
        setFieldErrors(messages);
      }
      setErrorMessage(
        apiError.message || "Payment failed. Check your details and retry.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading)
    return <section className="min-h-screen animate-pulse bg-bg-page" />;

  if (!session || !seatMap) {
    return (
      <section className="grid min-h-[70vh] place-items-center bg-bg-page px-4 text-center text-white">
        <div>
          <h1 className="text-2xl font-bold">Booking unavailable</h1>
          <p className="mt-3 text-sm text-white/50">{errorMessage}</p>
          <Link
            href="/sessions"
            className="mt-5 inline-flex text-sm font-semibold text-[#ec3013]"
          >
            Back to sessions
          </Link>
        </div>
      </section>
    );
  }

  if (order) {
    return (
      <section className="grid min-h-screen place-items-center bg-bg-page px-4 py-20 text-white">
        <div className="w-full max-w-lg rounded-3xl bg-[#0b1021] p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-400/10 text-2xl text-green-400">
            ✓
          </span>
          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-green-400">
            Booking confirmed
          </p>
          <h1 className="mt-2 text-2xl font-bold">
            You&apos;re going to the movies
          </h1>
          <p className="mt-3 text-sm text-white/50">
            Booking reference {order.reference}
          </p>
          <p className="mt-5 font-semibold">{order.session.movie.title}</p>
          <p className="mt-1 text-sm text-white/50">
            {order.session.date} · {order.session.time} ·{" "}
            {order.tickets.map((ticket) => ticket.seatCode).join(", ")}
          </p>
          <p className="mt-4 text-lg font-bold">
            ₾ {order.totalPrice.toFixed(2)}
          </p>
          <Link
            href="/tickets"
            className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[#ec3013] px-6 text-sm font-bold"
          >
            View my tickets
          </Link>
        </div>
      </section>
    );
  }

  const movie = session.movie;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b1b] text-white">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {movie.backdropUrl && (
          <Image
            src={movie.backdropUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover blur-[5px]"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,53,73,.9),rgba(7,11,27,.82))]" />
        <div className="absolute inset-0 bg-[#050817]/45" />
      </div>
      <div className="relative flex min-h-screen items-center justify-center p-3 py-8 sm:p-6">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          className="my-auto w-full max-w-[1040px] overflow-hidden rounded-[32px] bg-[#070b1b] p-8 shadow-[0_30px_100px_rgba(0,0,0,.55)]"
        >
          <header className="flex items-start justify-between pb-6">
            <div>
              <h1
                id="booking-title"
                className="text-2xl font-black tracking-tight"
              >
                {movie.title}
              </h1>
              <p className="mt-1 text-xs text-white/50">
                {session.venue.name} · Hall {session.hall.name} ·{" "}
                {formatDate(session.date)} · {session.time} ·{" "}
                {session.format?.name || "Standard"} ·{" "}
                {session.language?.name || "Original + Subtitles"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end rounded-xl bg-bg-card px-4 py-2">
                <span className="text-[10px] font-semibold uppercase text-white/40">
                  SEATS HELD
                </span>
                <span className="text-sm font-bold text-white tabular-nums">
                  {activeHold ? `${minutes}:${seconds}` : "7:48"}
                </span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 space-y-6">
              <div className="mb-[16px] grid grid-cols-2 rounded-2xl bg-bg-card p-1">
                <button
                  type="button"
                  onClick={() => setStep("seats")}
                  className={`h-10 rounded-xl text-xs font-bold transition-all ${step === "seats" ? "bg-[#ec3013] text-white shadow-md" : "text-white/50 hover:text-white"}`}
                >
                  SEATS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (activeHold) setStep("checkout");
                  }}
                  disabled={!activeHold}
                  className={`h-10 rounded-xl text-xs font-bold transition-all ${step === "checkout" ? "bg-[#ec3013] text-white shadow-md" : "text-white/50 disabled:opacity-50"}`}
                >
                  CHECKOUT
                </button>
              </div>

              {step === "seats" ? (
                <>
                  <div className="rounded-2xl bg-bg-card py-3 text-center text-[11px] font-bold uppercase tracking-wider text-white/60">
                    SCREEN
                  </div>
                  <div className="mt-[16px] max-h-[380px] space-y-4 overflow-x-auto pb-2 scrollbar-hide">
                    {seatMap.sections.map((section) => (
                      <section key={section.name} className="min-w-max">
                        <div className="space-y-3">
                          {section.rows.map((row) => (
                            <div
                              key={`${section.name}-${row.label}`}
                              className="flex items-center gap-4"
                            >
                              <span className="w-4 text-center text-xs font-bold text-white/60">
                                {row.label}
                              </span>
                              <div className="flex items-center gap-2">
                                {row.seats.map((seat) => {
                                  if (seat.state === "unavailable")
                                    return (
                                      <span
                                        key={seat.id}
                                        aria-hidden="true"
                                        className={`h-10 w-10 shrink-0 ${seat.aisleAfter ? "mr-6" : ""}`}
                                      />
                                    );
                                  const isSelected = Boolean(
                                    selectedSeats[seat.id],
                                  );
                                  const stateClass = isSelected
                                    ? "bg-[#ec3013] text-white"
                                    : seat.state === "available"
                                      ? "bg-bg-card text-white hover:bg-[#ec3013]"
                                      : seat.state === "held"
                                        ? "cursor-not-allowed bg-[repeating-linear-gradient(135deg,#303246,#303246_6px,#222538_6px,#222538_12px)] text-white/35"
                                        : "cursor-not-allowed bg-[#171a29] text-white/25";
                                  return (
                                    <button
                                      key={seat.id}
                                      type="button"
                                      aria-label={`Seat ${seat.code}`}
                                      aria-pressed={isSelected}
                                      disabled={
                                        seat.state !== "available" ||
                                        Boolean(activeHold)
                                      }
                                      onClick={() => onToggleSeat(seat)}
                                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-bold transition-all ${stateClass} ${seat.aisleAfter ? "mr-6" : ""}`}
                                    >
                                      {seat.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-[11px] text-white/60">
                    <Legend className="bg-bg-card" label="Available" />
                    <Legend className="bg-[#ec3013]" label="Selected" />
                    <Legend className="bg-[#171a29]" label="Sold" />
                    <Legend
                      className="bg-[repeating-linear-gradient(135deg,#303246,#303246_4px,#222538_4px,#222538_8px)]"
                      label="Held by another user"
                    />
                  </div>
                </>
              ) : (
                <form onSubmit={submitOrder} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase text-white/60">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Text"
                      value={contact.fullName}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, fullName: e.target.value }))
                      }
                      className="mb-[16px] h-12 w-full rounded-2xl bg-bg-card px-4 text-sm text-white outline-none placeholder:text-white/30 focus:bg-[#182035]"
                    />
                    {fieldErrors.fullName && (
                      <span className="mt-1 text-[10px] text-[#ff4b37]">
                        {fieldErrors.fullName}
                      </span>
                    )}
                  </div>

                  <div className="mb-[16px] grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase text-white/60">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. Text"
                        value={contact.email}
                        onChange={(e) =>
                          setContact((c) => ({ ...c, email: e.target.value }))
                        }
                        className="h-12 w-full rounded-2xl bg-bg-card px-4 text-sm text-white outline-none placeholder:text-white/30 focus:bg-[#182035]"
                      />
                      {fieldErrors.email && (
                        <span className="mt-1 text-[10px] text-[#ff4b37]">
                          {fieldErrors.email}
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase text-white/60">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Text"
                        value={contact.mobileNumber}
                        onChange={(e) =>
                          setContact((c) => ({
                            ...c,
                            mobileNumber: e.target.value,
                          }))
                        }
                        className="h-12 w-full rounded-2xl bg-bg-card px-4 text-sm text-white outline-none placeholder:text-white/30 focus:bg-[#182035]"
                      />
                      {fieldErrors.mobileNumber && (
                        <span className="mt-1 text-[10px] text-[#ff4b37]">
                          {fieldErrors.mobileNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase text-white/60">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Text"
                      value={contact.cardNumber}
                      onChange={(e) =>
                        setContact((c) => ({
                          ...c,
                          cardNumber: e.target.value,
                        }))
                      }
                      className="h-12 w-full rounded-2xl bg-bg-card px-4 text-sm text-white outline-none placeholder:text-white/30 focus:bg-[#182035]"
                    />
                    {fieldErrors.cardNumber && (
                      <span className="mt-1 text-[10px] text-[#ff4b37]">
                        {fieldErrors.cardNumber}
                      </span>
                    )}
                  </div>

                  <div className="mt-[16px] grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase text-white/60">
                        Expiry
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Text"
                        value={contact.expiry}
                        onChange={(e) =>
                          setContact((c) => ({ ...c, expiry: e.target.value }))
                        }
                        className="h-12 w-full rounded-2xl bg-bg-card px-4 text-sm text-white outline-none placeholder:text-white/30 focus:bg-[#182035]"
                      />
                      {fieldErrors.expiry && (
                        <span className="mt-1 text-[10px] text-[#ff4b37]">
                          {fieldErrors.expiry}
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase text-white/60">
                        CVV
                      </label>
                      <input
                        type="password"
                        placeholder="e.g. Text"
                        value={contact.cvv}
                        onChange={(e) =>
                          setContact((c) => ({ ...c, cvv: e.target.value }))
                        }
                        className="h-12 w-full rounded-2xl bg-bg-card px-4 text-sm text-white outline-none placeholder:text-white/30 focus:bg-[#182035]"
                      />
                      {fieldErrors.cvv && (
                        <span className="mt-1 text-[10px] text-[#ff4b37]">
                          {fieldErrors.cvv}
                        </span>
                      )}
                    </div>
                  </div>
                  {errorMessage && (
                    <p role="alert" className="text-xs text-[#ff4b37]">
                      {errorMessage}
                    </p>
                  )}
                </form>
              )}
            </div>

            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">
                  {step === "seats"
                    ? `Your seats · Max ${maxSeats}`
                    : "Summary"}
                </h3>

                {step === "seats" ? (
                  <div className="space-y-3">
                    {selected.map(({ seat, ticketType }) => {
                      const currentType = ticketTypes.find(
                        (t) => t.slug === ticketType,
                      );
                      const price =
                        (session.price || 16) * (currentType?.priceRatio || 1);
                      return (
                        <div
                          key={seat.id}
                          className="my-[16px] space-y-3 rounded-2xl bg-bg-card p-4"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-xs text-white/50">
                              Seat{" "}
                              <strong className="font-bold text-white">
                                {seat.code}
                              </strong>
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">
                                ₾{price}
                              </span>
                              <button
                                type="button"
                                onClick={() => onToggleSeat(seat)}
                                className="text-white/40 hover:text-white"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {ticketTypes.map((type) => {
                              const active = ticketType === type.slug;
                              return (
                                <button
                                  key={type.id}
                                  type="button"
                                  onClick={() =>
                                    updateTicketType(seat.id, type.slug)
                                  }
                                  className={`h-9 flex-1 rounded-xl text-[11px] font-bold transition-all ${active ? "bg-[#ec3013] text-white" : "bg-[#1c2235] text-white/70 hover:text-white"}`}
                                >
                                  {type.name}{" "}
                                  {Math.round((type.priceRatio || 1) * 100)}%
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {!selected.length && (
                      <p className="py-4 text-xs text-white/40">
                        Pick up to {maxSeats} seats from the map.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 rounded-2xl bg-bg-card p-5">
                    <p className="text-sm font-bold text-white">
                      {movie.title}
                    </p>
                    <p className="text-[11px] text-white/50">
                      Hall {session.hall.name} · {session.date} · {session.time}
                    </p>
                    <div className="flex items-center justify-between pt-2 text-xs">
                      <span className="text-white/50">Seats</span>
                      <span className="font-bold text-white">
                        {selected.length
                          ? selected.map((s) => s.seat.code).join(", ")
                          : "B3, B4, B5"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">Tickets</span>
                      <span className="font-bold text-white">
                        {selected.length
                          ? `${selected.length} x Standard`
                          : "2 x Adult, 1 x Child"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-white/50">
                    SUBTOTAL
                  </span>
                  <span className="text-3xl font-black text-white">
                    ₾ {total || 32}
                  </span>
                </div>
                {step === "seats" ? (
                  <button
                    type="button"
                    onClick={beginHold}
                    disabled={isHolding || !selected.length}
                    className={`h-12 w-full rounded-2xl text-sm font-bold text-white transition-all ${selected.length ? "bg-[#ec3013] hover:brightness-110" : "cursor-not-allowed bg-[#52596D]"}`}
                  >
                    {isHolding ? "Reserving..." : "Checkout"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitOrder}
                    disabled={isCheckingOut}
                    className="h-12 w-full rounded-2xl bg-[#ec3013] text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
                  >
                    {isCheckingOut ? "Processing..." : "Complete order"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const Legend = ({ className, label }: { className: string; label: string }) => (
  <span className="flex items-center gap-2">
    <span className={`h-3 w-3 rounded-sm ${className}`} />
    {label}
  </span>
);
