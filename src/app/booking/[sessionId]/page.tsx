import { BookingPage } from "@/components/booking/BookingPage";

export default async function Page({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const parsedSessionId = Number(sessionId);
  if (!Number.isInteger(parsedSessionId) || parsedSessionId < 1) {
    return <BookingPage sessionId={-1} />;
  }
  return <BookingPage sessionId={parsedSessionId} />;
}
