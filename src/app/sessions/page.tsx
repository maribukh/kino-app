import { SessionsPage } from "@/components/sessions/SessionsPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const initialParams = await searchParams;
  const initialDate = new Date().toISOString().slice(0, 10);
  return (
    <SessionsPage initialParams={initialParams} initialDate={initialDate} />
  );
}
