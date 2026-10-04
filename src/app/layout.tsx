import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kino XII",
  description: "Movie ticket booking app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg-page text-text-primary">
        <Header />

        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
