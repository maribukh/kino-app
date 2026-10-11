import { MovieDetailsPage } from "@/components/movies/MovieDetailsPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <MovieDetailsPage slug={slug} />;
}
